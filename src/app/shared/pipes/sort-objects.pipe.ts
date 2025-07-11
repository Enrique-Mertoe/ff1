import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortObjects'
})
export class SortObjectsPipe implements PipeTransform {

  transform(item: any[], key): any {
    return item.sort((a, b) => {
      if (typeof a[key] === 'string') {
        return a[key].localeCompare(b[key]);
      } else if (typeof a[key] === 'number') {
        return a - b[key];
      }
      return false;
    });
  }

}
