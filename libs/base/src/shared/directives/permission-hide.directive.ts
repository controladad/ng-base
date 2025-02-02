import { ChangeDetectorRef, Directive, ElementRef, Host, Input, OnInit, Optional, Self } from '@angular/core';
import { ActionTypes } from '../../core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { CacButtonComponent } from '../components';

// TODO: Fix Permissions

@Directive({
  selector: '[uiPermissionHide]',
  standalone: true,
})
export class PermissionHideDirective implements OnInit {
  @Input() uiPermissionHide?: string | boolean = true;
  @Input() uiPermissionHideAction?: ActionTypes;
  @Input() uiPermissionHideKey?: string;

  constructor(
    private host: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
    @Host() @Self() @Optional() private hostButton?: CacButtonComponent,
  ) {
    // toObservable(this.role.currentUserAllowedActions)
    //   .pipe(takeUntilDestroyed())
    //   .subscribe(() => {
    //     this.updateView();
    //   });
  }

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    let actions: ActionTypes | ActionTypes[] | undefined;
    let permission: string | undefined;

    if (this.hostButton) {
      actions = this.hostButton.action;
      permission = this.hostButton.permission;
    }

    actions = actions ?? this.uiPermissionHideAction;
    permission = permission ?? this.uiPermissionHideKey;

    if (!actions && !permission) return;

    // const hasPermission = permission ? this.role.hasPermission(permission) : this.role.hasActionPermission(actions);
    const hasPermission = true;

    if ((this.uiPermissionHide || this.uiPermissionHide === '') && !hasPermission) {
      this.host.nativeElement.classList.add(
        'hidden',
        'absolute',
        'opacity-0',
        'invisible',
        'pointer-events-none',
        'w-0',
        'h-0',
        'overflow-hidden',
      );

      this.cdr.detectChanges();
    }
  }
}
