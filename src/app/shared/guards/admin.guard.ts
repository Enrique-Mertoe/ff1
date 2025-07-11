import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {Observable} from "rxjs";
import {NotificationService} from "../services/notification.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
              private authService: AuthService,
              private notificationService: NotificationService
              ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAdmin()) {
      return true;

    } else {
      this.notificationService.warn('Access denied');
      this.router.navigate(['/auth/login']).then( () =>{});
      return false;
    }
  }

}
