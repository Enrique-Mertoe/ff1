import { Pipe, PipeTransform } from '@angular/core';
import {DataService} from '../services/data.service';

@Pipe({
  name: 'imageThumb',
  standalone: true
})
export class ImageThumbPipe implements PipeTransform {
  constructor(private dataService: DataService) { }
  transform(value: string, css = true): unknown {
    // Created to avoid calling methods in the template, which creates memory leaks when used in loop.
    // It call the method on any template change
    return this.dataService.getThumb(value, css);
  }
}
