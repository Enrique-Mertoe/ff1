import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitTo',
  standalone: true
})
export class LimitToPipe implements PipeTransform {

  transform(value: string, limitTo: number): string {

    if (value === undefined || value === null) {
      return '';
    }

    const limit = limitTo ? limitTo : 10;
    const trail = '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }

}
