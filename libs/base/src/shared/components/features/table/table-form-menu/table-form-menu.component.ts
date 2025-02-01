import { Component, EventEmitter, Input, OnDestroy, Output, signal, ViewChild } from '@angular/core';
import { BottomControlsComponent } from '../../bottom-controls';
import { FormBuilderComponent } from '../../form-builder';
import { IconComponent, ButtonClickEvent } from '../../../ui';

import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { TableFormOptions, TableMenu, TableOptions } from '../table.interfaces';
import { Subject, Subscription, take } from 'rxjs';
import { A11yModule } from '@angular/cdk/a11y';

// undefined is when you dismiss the menu;
type MenuCloseReason = 'success' | 'cancel' | undefined;

@Component({
  selector: 'feature-table-form-menu',
  standalone: true,
  imports: [BottomControlsComponent, FormBuilderComponent, IconComponent, MatMenuModule, A11yModule],
  templateUrl: './table-form-menu.component.html',
  styleUrls: ['./table-form-menu.component.scss'],
})
export class TableFormMenuComponent implements OnDestroy {
  readonly EDIT_TEXT = $localize`:@@base.feature.table.formMenu.editText:تغییر دادن`;
  readonly NEW_TEXT = $localize`:@@base.feature.table.formMenu.newText:جدید`;
  readonly ADD_TEXT = $localize`:@@base.feature.table.formMenu.addText:اضافه`;

  @ViewChild('MenuForm') menuForm!: MatMenu;
  @ViewChild('Form') formBuilder?: FormBuilderComponent<any>;

  @Input() options!: TableOptions<any>;

  @Output() onClosed = new EventEmitter();

  formOptions = signal<TableFormOptions<any> | undefined>(undefined);
  showForm = signal(false);

  onAction = new Subject<any>();
  onSubmit = new Subject<any>();

  private _currentTrigger?: MatMenuTrigger;
  private _action?: TableMenu<any>['action'];
  private _sub = new Subscription();
  private _maintainState = false;

  ngOnDestroy() {
    this.destroySubscriptions();
  }

  onFormMenuSubmit(e: ButtonClickEvent) {
    const model = this.formBuilder?.getValues();
    if (!model) return;
    if (this._action) {
      this._sub = this._action(model)
        .pipe(e.pipe())
        .subscribe((res) => {
          this.onAction.next(res);
          this.closeMenu('success');
        });
    } else {
      this.onSubmit.next(null);
      this.closeMenu('success');
    }
  }

  onFormMenuCancel() {
    this.closeMenu('cancel');
  }

  openFormMenu<T, U>(trigger: MatMenuTrigger, options: TableFormOptions<T, U>) {
    this.showForm.set(true);
    this.formOptions.set(options);

    if (!this._maintainState || trigger !== this._currentTrigger) {
      options.formBuilder.reset(options.value);
    }

    const menu = this.openMenu(this.menuForm, trigger);

    return menu;
  }

  private openMenu(menu: MatMenu, trigger: MatMenuTrigger) {
    this._maintainState = false;
    this._currentTrigger = trigger;
    this.onSubmit = new Subject();
    this.onAction = new Subject();
    setTimeout(() => {
      trigger.menu = menu;
      trigger.openMenu();

      trigger.menu?.close.pipe(take(1)).subscribe((_reason) => {
        let reason = _reason as MenuCloseReason;
        if (reason === undefined) {
          this._maintainState = true;
        } else if (reason !== 'success' && reason !== 'cancel') {
          reason = undefined;
        }

        this.cleanupMenuForm(reason);
      });
    }, 1);

    return {
      trigger: trigger,
      onClose: trigger.menuClosed.pipe(),
      onSubmit: this.onSubmit.pipe(take(1)),
      action: (action) => {
        this._action = action;
        return this.onAction.asObservable();
      },
    } as TableMenu<any>;
  }

  private cleanupMenuForm(reason: MenuCloseReason) {
    this.destroySubscriptions();
    if (this._currentTrigger) {
      this._currentTrigger.menu = null;
    }

    // Delay to make sure menu is fully closed and the animation is finished
    setTimeout(() => {
      this.showForm.set(false);
      if (reason === 'success' || reason === 'cancel') {
        this.formBuilder?.reset();
      }
    }, 300);
  }

  private destroySubscriptions() {
    this._sub?.unsubscribe();
    this.onSubmit.complete();
    this.onAction.complete();
  }

  private closeMenu(reason: MenuCloseReason) {
    this._currentTrigger?.menu?.close.emit(reason as any);
  }
}
