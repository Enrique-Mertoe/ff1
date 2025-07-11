import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMoney',
  standalone: true
})
export class FormatMoneyPipe implements PipeTransform {
  constructor() { }
  transform(value: number): unknown {
    // Create our number formatter.
    const formatter = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: "MWK", //this.dataService.config.currencyCode,

      // These options are needed to round to whole numbers if that's what you want.
      // minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      // maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    return formatter.format(value).replace('.', "."); /* $2,500.00 */
    // return value.toFixed(2).replace('.', this.dataService.config.decimalSeparator);
  }

}
