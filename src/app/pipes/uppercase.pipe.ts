import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercase',
})
export class UppercasePipe implements PipeTransform {
  transform(value: string): any {
    if (value) {
      return value.toUpperCase();
    }
  }
}
