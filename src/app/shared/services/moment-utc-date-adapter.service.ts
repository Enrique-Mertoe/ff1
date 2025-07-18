import { Inject, Injectable, Optional } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import * as moment from 'moment';
import {MAT_DATE_LOCALE} from "@angular/material/core";

@Injectable({
  providedIn: 'root'
})
export class MomentUtcDateAdapterService extends MomentDateAdapter {

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
    super(dateLocale);
  }

  override createDate(year: number, month: number, date: number): Moment {
    // Moment.js will create an invalid date if any of the components are out of bounds, but we
    // explicitly check each case so we can throw more descriptive errors.
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    // const dt = new Date();
    // dt.setFullYear(year);
    // dt.setMonth(month);
    // dt.setDate(date);

    let result = moment.utc({year, month, date}).locale(this.locale);
    // let result = moment(dt, 'YYYY-MM-DD HH:mm:ss');

    // If the result isn't valid, the date must have been out of bounds for this month.
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }
}
