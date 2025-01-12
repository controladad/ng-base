import { Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { MatCellDef, MatColumnDef, MatFooterCellDef, MatHeaderCellDef, MatTable } from '@angular/material/table';
import { TableOptions } from '../table.interfaces';

@Component({
  selector: 'feature-base-table-col',
  template: '',
  styles: [],
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TableColBase implements OnInit, OnDestroy {
  @Input() prop!: string;
  @Input() options!: TableOptions<any>;

  @ViewChild(MatColumnDef, { static: true }) columnDef!: MatColumnDef;
  @ViewChild(MatCellDef, { static: true }) cellDef!: MatCellDef;
  @ViewChild(MatHeaderCellDef, { static: true }) headerCellDef!: MatHeaderCellDef;
  @ViewChild(MatFooterCellDef, { static: true }) footerCellDef!: MatFooterCellDef;

  constructor(@Optional() public table?: MatTable<unknown>) {}

  ngOnInit() {
    this.initializeMatColDef();
  }

  ngOnDestroy(): void {
    this.table?.removeColumnDef(this.columnDef);
  }

  private initializeMatColDef() {
    if (!this.table || !this.columnDef) return;

    this.columnDef.name = this.prop;
    this.columnDef.cell = this.cellDef;
    this.columnDef.headerCell = this.headerCellDef;
    this.columnDef.footerCell = this.footerCellDef;
    this.table.addColumnDef(this.columnDef);
  }
}
