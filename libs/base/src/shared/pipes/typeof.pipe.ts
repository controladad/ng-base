import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeOf',
  standalone: true,
  pure: true,
})
export class TypeofPipe implements PipeTransform {
  transform(value: any, type: 'string' | 'number' | 'undefined' | 'boolean' | 'object' | 'array'): boolean {
    return type === 'array' ? value instanceof Array : typeof value === type;
  }
}
