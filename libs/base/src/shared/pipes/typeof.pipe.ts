import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeof',
  standalone: true,
  pure: true,
})
export class TypeofPipe implements PipeTransform {
  transform(value: any, type: 'string' | 'number' | 'undefined' | 'boolean' | 'object' | 'array'): unknown {
    return type === 'array' ? value instanceof Array : typeof value === type;
  }
}
