import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yesNo',
  standalone: true
})
export class YesNoPipe implements PipeTransform {

  transform(value: any): string {
    return typeof value == 'string' ? value === 'Y'? 'Yes' : 'No' : value? 'Yes' : 'No';
  }

}
