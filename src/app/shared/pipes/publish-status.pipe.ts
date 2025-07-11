import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'publishStatus',
  standalone: true
})
export class PublishStatusPipe implements PipeTransform {

  transform(value: number): string {
    return value == 1 ? 'Published' : 'Draft';
  }

}
