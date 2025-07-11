import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatThousandPipe',
  standalone: true,
})
export class FormatThousandPipePipe implements PipeTransform {

  transform(value: number, option: string): any {
    if (typeof value === 'number') {
      return formatNumber(value);
    }
    else {

        // return formatNumber(value.filter((it: ProductTag) => it.tagName === option).length);
    }
  }

}
function formatNumber(num) {
  return Math.abs(num) > 999 ? Math.sign(num) * (((Math.abs(num) / 1000) as any).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num);
}
