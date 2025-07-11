import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPhoneNumber',
  standalone: true,
})
export class FormatPhoneNumberPipe implements PipeTransform {

  transform(value: any, option: string = 'c'): any {
    // call = c, whats app = w, for whats app remove +
    if (option === 'c') {
      return value.toString().includes('+') ? value : '+' + value;
    }
    if (option === 'w') {
      return value.toString().includes('+') ? value.toString().replace('+', '').trim() : value;
    }
    return formatPhoneNumber(value);
  }

}
function formatPhoneNumber(phoneNumberString) {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}
