import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { TableColumnData } from '../table.component';
import { FormBuilder, formBuilder, FormBuilderComponent } from '../../form-builder';

import { BottomControlsComponent } from '../../bottom-controls';
import { TableFilterModel } from '../../../../classes';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { A11yModule } from '@angular/cdk/a11y';
import { formControl, FormControlExtended } from '../../../../forms';

@Component({
  selector: 'feature-table-filter-menu',
  standalone: true,
  imports: [FormBuilderComponent, BottomControlsComponent, MatMenuModule, A11yModule],
  templateUrl: './table-filter-menu.component.html',
  styleUrls: ['./table-filter-menu.component.scss'],
})
export class TableFilterMenuComponent<T> implements OnInit, AfterViewInit {
  destroyRef = inject(DestroyRef);

  @ViewChild('Form') formBuilder!: FormBuilderComponent<any>;
  @ViewChild('FilterMenu') menu!: MatMenu;

  @Input() column!: TableColumnData<T>;
  @Input() filterModel!: TableFilterModel;
  @Input() trigger!: MatMenuTrigger;

  @Output() onSubmit = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  form = signal<FormBuilder<any> | undefined>(undefined);
  show = signal(false);

  private _lastValue?: any;

  ngOnInit() {
    this.filterModel.columnsChanged$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.form.set(this.createFormOptions());
    });

    this.filterModel.changes$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((filters) => {
      const value = filters?.[this.column.prop];
      this._lastValue = value;
      this.form()!.reset(value);
    });
  }

  ngAfterViewInit() {
    this.trigger.menu = this.menu;
    this.trigger.menuOpened.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.show.set(true);
    });
    this.trigger.menuClosed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      // Delay to make sure menu is fully closed and the animation is finished
      setTimeout(() => {
        this.formBuilder?.reset();
        this.show.set(false);
      }, 300);
    });
  }

  private createFormOptions() {
    const inputs: FormBuilder<any>['inputs'] = {};
    let count = 0;
    for (const filter of this.filterModel.getColumnFilters(this.column.prop) ?? []) {
      count++;
      inputs[filter.key ?? filter.type] = {
        control: formControl(''),
        label:
          filter.label ??
          (filter.type === 'contains'
            ? $localize`:@@base.feature.table.filters.contains:Contains`
            : filter.type === 'equal'
              ? $localize`:@@base.feature.table.filters.equals:Equals`
              : filter.type === 'greater'
                ? $localize`:@@base.feature.table.filters.greaterThan:Greater Than`
                : filter.type === 'lower'
                  ? $localize`:@@base.feature.table.filters.lowerThan:Less Than`
                  : ''),
        type: filter.controlType,
        inputType: filter.inputType,
        items: filter.items,
        multiple: filter.multiple,
        hideError: true,
      };
    }

    return formBuilder({
      cols: count >= 4 ? 2 : 1,
      inputs,
    });
  }

  submit() {
    const columnFilters = this.filterModel.getColumnFilters(this.column.prop);
    if (!columnFilters) return;

    const controls = this.form()!.formGroup.controls;

    this.filterModel.set(
      this.column,
      columnFilters
        .map((t) => ({
          key: t.key,
          type: t.type,
          value: controls[t.key ?? t.type].value,
          displayText: (controls[t.key ?? t.type] as FormControlExtended).displayText,
          controlType: t.controlType,
        }))
        .filter((t) => t.value !== undefined && t.value !== null),
    );

    this.trigger.closeMenu();
    this.onSubmit.emit();
  }

  cancel() {
    this.form()!.reset(this._lastValue);

    this.trigger.closeMenu();
    this.onCancel.emit();
  }
}
