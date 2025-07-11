import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, tap} from "rxjs";
import { SpinnerService } from '../services/spinner.service';


@Injectable({
  providedIn: 'root'
})
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private spinnerService: SpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.spinnerService.show();
    // this.spinnerService.visibility.subscribe(it => {
    //   if(!it) {
    //     // console.log('cancelled');
    //     // next.handle(null);
    //     return NEVER;
    //   }
    //   return next.handle(req);
    // });

    return next
      .handle(req)
      .pipe(
        tap({ next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.spinnerService.hide();
          }
        }, error: (error) => {
          this.spinnerService.hide();
        }})
      );
  }
}
