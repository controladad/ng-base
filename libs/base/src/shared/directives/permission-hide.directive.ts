import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import { ActionTypes } from '../../core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

// TODO: Fix Permissions

// Removed the code for accessing button permission inputs, caused Circular Dependency

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

    // if (this.hostButton) {
    //   actions = this.hostButton.action;
    //   permission = this.hostButton.permission;
    // }

    // eslint-disable-next-line prefer-const
    actions = actions ?? this.uiPermissionHideAction;
    // eslint-disable-next-line prefer-const
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
