import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { combineLatest, retry, timer } from 'rxjs';
import { CacLoaderScreenComponent } from '../../ui';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthBaseStore } from '../../../../core';

@Component({
  selector: 'cac-initialization-protection',
  standalone: true,
  imports: [CacLoaderScreenComponent],
  templateUrl: './initialize-protection.component.html',
  styleUrls: ['./initialize-protection.component.scss'],
})
export class CacInitializeProtectionComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly auth = inject(AuthBaseStore);

  refreshed = signal(false);
  errored = signal(false);

  @Input() refreshInterval?: number;

  @Output() onRefreshSuccessful = new EventEmitter();

  ngOnInit() {
    combineLatest([this.auth.refresh(this.refreshInterval)])
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        retry({
          count: 1,
          delay: (err) => {
            if (err?.status === 0) {
              throw err;
            }
            return timer(500);
          },
        }),
      )
      .subscribe({
        next: () => {
          this.refreshed.set(true);
          this.onRefreshSuccessful.emit();
        },
        error: () => {
          this.errored.set(true);
        },
      });
  }
}
