import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Injector,
  Input,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { ScreenDetectorService } from '@al00x/screen-detector';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent, IconComponent, LoaderScreenComponent } from '../../ui';
import { AttachmentCacheService, AuthStore, RouteHelperService, RouteItem } from '../../../../core';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MainLayoutService } from './main-layout.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { concatMap, merge, of, take } from 'rxjs';
import { NgLetDirective } from '../../../directives';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'feature-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonComponent,
    IconComponent,
    NgTemplateOutlet,
    NgForOf,
    NgIf,
    AsyncPipe,
    MatSidenavModule,
    MatTabsModule,
    MatIconModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    LoaderScreenComponent,
    MatButtonToggleModule,
    MatProgressBarModule,
    NgLetDirective,
    MatMenuModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  readonly injector = inject(Injector);
  readonly destroyRef = inject(DestroyRef);
  readonly attachmentCache = inject(AttachmentCacheService);

  @ViewChild('TopbarTabGroup') topbarTabGroupComponent!: MatTabGroup;

  @Input() logoutStyle: 'icon' | 'text' = 'text';

  sidenavOpened = signal(false);
  currentTopbarIndex = signal(0);
  profileUrl = signal('/assets/base/images/default-profile.webp');
  userInfo: WritableSignal<string | null> = signal('');

  constructor(
    public layout: MainLayoutService,
    public screenDetector: ScreenDetectorService,
    private auth: AuthStore,
    public routeHelper: RouteHelperService,
    private cdr: ChangeDetectorRef,
  ) {
    merge(toObservable(this.layout.loading), toObservable(this.layout.softLoading))
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.cdr.detectChanges();
      });

    this.auth.state$
      .pipe(
        concatMap((state) => {
          this.userInfo.set(`${state?.user?.firstName || ''} ${state?.user?.lastName || ''}`);
          if (state.user?.profileImagePath) {
            return this.attachmentCache.fetch(state.user?.profileImagePath);
          } else {
            return of(null);
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            this.profileUrl.set(url);
          }
        },
      });
  }

  onLogout() {
    dialog$
      .prompt({
        title: '',
        message: 'آیا از خروج از حساب کاربری خود اطمینان دارید ؟',
        yesButtonText: 'خروج',
        noButtonText: 'لغو',
      })
      .afterSubmit()
      .pipe(take(1))
      .subscribe(() => {
        this.auth.logout();
      });
  }

  onTopbarKeyEnter() {
    const index = this.currentTopbarIndex();
    this.childNavigate(this.routeHelper.routeChildrenItems()[index]);
  }

  parentNavigate(item: RouteItem) {
    this.routeHelper.navigateByParent(item);
    this.sidenavOpened.set(false);
  }

  childNavigate(item: RouteItem) {
    this.routeHelper.navigateByChild(item);
  }

  onOpenProfile() {
    const userInfo = this.userInfo();
    if (!userInfo) return;
    dialog$
      .profile({ profileImageUrl: this.profileUrl(), userFullname: userInfo })
      .afterSubmit()
      .pipe(take(1))
      .subscribe((result) => {
        if (result === 'change-password') {
          dialog$.changePassword().afterSubmit();
        } else if (result === 'signout') {
          this.onLogout();
        }
      });
  }
}
