import {Directive, HostBinding, Input} from '@angular/core';

@Directive({
  selector: 'img[default]',
  standalone: true,
  host: {
    '(error)': 'updateUrl()',
    '(load)': 'load()',
    '[src]': 'src'
  }
})
export class ImagePlaceholderDirective {
  @Input() src:string;
  @Input() default:string;
  @HostBinding('class') className

  updateUrl() {
    this.src = this.default;
  }
  load(){
    this.className = 'image-loaded';
  }

}
