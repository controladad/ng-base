import { Pipe, PipeTransform } from '@angular/core';
import * as dateFns from 'date-fns-jalali';

@Pipe({
  name: 'datefns',
  standalone: true,
})
export class DatefnsPipe implements PipeTransform {
  transform(value: string | Date | undefined | null, format = 'yyyy/MM/dd, hh:mm a'): string {
    if (!value) return '';
    return dateFns.format(typeof value === 'string' ? new Date(value) : value, format);
  }
}
