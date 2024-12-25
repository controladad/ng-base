import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'badge',
  standalone: true,
  pure: true,
})
export class BadgePipe implements PipeTransform {
  transform(value: number | undefined | null, length = 2): string {
    if (value === null || value === undefined) return '';
    const text = value.toString();
    return text.length > length ? '9'.repeat(length) : text;
  }
}
