import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {


    constructor() { }

    handleError(error: Error) {
        // Obtain dependencies at the time of the error
        // This is because the GlobalErrorHandler is registered first
        // which prevents constructor dependency injection
        // const logger = this.injector.get(NGXLogger);

        const err = {
            message: error.message ? error.message : error.toString(),
            stack: error.stack ? error.stack : ''
        };

        // Log  the error
        console.error(err);

        // Re-throw the error
        throw error;
    }
}
