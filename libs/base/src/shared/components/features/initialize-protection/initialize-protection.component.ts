import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { combineLatest, retry, timer } from 'rxjs';
import { LoaderScreenComponent } from '../../ui';
import { AuthStore } from '../../../../core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'feature-initialization-protection',
  standalone: true,
  imports: [LoaderScreenComponent],
  templateUrl: './initialize-protection.component.html',
  styleUrls: ['./initialize-protection.component.scss'],
})
export class InitializeProtectionComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  refreshed = signal(false);
  errored = signal(false);

  @Input() refreshInterval?: number;

  @Output() onRefreshSuccessful = new EventEmitter();

  constructor(private auth: AuthStore) {}

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
