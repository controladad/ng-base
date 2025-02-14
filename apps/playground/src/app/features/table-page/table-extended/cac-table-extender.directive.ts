import { Directive } from '@angular/core';
import { CacTableComponent, TableClass, TableColumnType, TableOptions } from '@controladad/ng-base';

const NewColumnTypes = ['test'] as const;
type ExtendedCols = TableColumnType | (typeof NewColumnTypes)[0];

export function table<T extends object>(options?: TableOptions<T, ExtendedCols>): TableClass<T, ExtendedCols> {
  return new TableClass(options);
}

@Directive({
  selector: 'cac-table',
  standalone: true,
})
export class CacTableExtenderDirective {
  constructor(public host: CacTableComponent<any>) {
    console.log('HELOOOOO!')
    this.host.additionalColToTransformFn = {
      'test': () => 'TEST',
    }
  }
}
