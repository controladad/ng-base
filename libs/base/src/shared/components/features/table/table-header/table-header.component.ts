import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonClickEvent, ButtonComponent, FieldComponent } from '../../../ui';
import { TableBulkAction, TableOptions } from '../table.interfaces';
import { PermissionHideDirective } from '../../../../directives';
import { MatMenuTrigger } from '@angular/material/menu';
import { formControl } from '../../../../forms';
import { ItemRecord } from '../../../../../core';

@Component({
  selector: 'feature-table-header',
  imports: [ButtonComponent, FieldComponent, PermissionHideDirective, MatMenuTrigger],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.scss',
})
export class TableHeaderComponent {
  @Input() options!: TableOptions<any>;
  @Input() loading = false;
  @Input() totalItems = 0;
  @Input() bulkActions: ItemRecord<TableBulkAction<any>>[] = [];

  @Output() onAdd = new EventEmitter<ButtonClickEvent>();
  @Output() onExport = new EventEmitter<ButtonClickEvent>();
  @Output() onPrint = new EventEmitter<ButtonClickEvent>();
  @Output() onBulkAction = new EventEmitter<{ value: any, e: ButtonClickEvent }>();
  @Output() onRefresh = new EventEmitter<ButtonClickEvent>();

  bulkActionControl = formControl<TableBulkAction<any> | undefined>();
  ADD_TEXT = $localize`:@@base.feature.table.header.addText:Add`;
}
