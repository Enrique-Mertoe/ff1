import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router,
              private dialog: MatDialog) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.authService.getToken();

    if (token && token !=='') {

      const cloned = req.clone({
        headers: req.headers.set('Authorization',
          'Bearer ' + token)
      });

      return next.handle(cloned).pipe(tap({ next: x => { }, error: err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401 && !this.authService.isLogged()) {
              this.dialog.closeAll();
              this.router.navigate(['/auth/login']).then( () =>{});
            }
          }
        }}));

    } else {
      return next.handle(req);
    }
  }
}

