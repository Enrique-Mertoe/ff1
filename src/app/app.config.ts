import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {SimpleNotificationsModule} from "angular2-notifications";
import {DateAdapter, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentUtcDateAdapterService} from "./shared/services/moment-utc-date-adapter.service";
import {ConfigLoader, ConfigService} from "./shared/services/config.service";
import {AuthGuard} from "./shared/guards/auth.guard";
import {AdminGuard} from "./shared/guards/admin.guard";
import {MediaMatcher} from "@angular/cdk/layout";
import {SpinnerInterceptor} from "./shared/interceptors/spinner.interceptor";
import {AuthInterceptor} from "./shared/interceptors/auth.interceptor";
import {CanDeactivateGuard} from "./shared/guards/can-deactivate.guard";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    // { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentUtcDateAdapterService },
    // LocaleService,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigLoader,
      deps: [ConfigService],
      multi: true
    },
    AuthGuard,
    AdminGuard,
    MediaMatcher,
    CanDeactivateGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    importProvidersFrom(SimpleNotificationsModule.forRoot(),
      // NgxDaterangepickerMd.forRoot({
      //   applyLabel: 'Okay',
      //   firstDay: 1
      // })
    ),
  ]
};
