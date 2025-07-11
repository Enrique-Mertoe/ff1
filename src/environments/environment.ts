// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// import {NgxLoggerLevel} from "ngx-logger";

export const environment = {
  production: false,
  // apiURL: 'http://host01.example.com:7011/rbm-apis/dataportal-ws',
  apiURL: 'http://localhost:8080/api/nwra-apis/ewaterpermit-ws/v1',
  systemId: 'f6d04a12-39b7-11ed-8980-94659cc92a92',
  // logLevel: NgxLoggerLevel.TRACE,
  // serverLogLevel: NgxLoggerLevel.OFF
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
