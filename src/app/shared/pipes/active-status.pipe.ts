import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeStatus',
  standalone: true,
})
export class ActiveStatusPipe implements PipeTransform {

  transform(value: number): string {
    return value == 1 ? 'Active' : 'Inactive';
  }
}
