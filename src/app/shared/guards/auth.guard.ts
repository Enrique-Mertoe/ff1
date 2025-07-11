import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import moment from 'moment';
import {AuthService} from "../services/auth.service";
import {NotificationService} from "../services/notification.service";
import {DataService} from "../services/data.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private notificationService: NotificationService,
              private authService: AuthService,
              private dataService: DataService
              ) { }

  canActivate() {
    if (this.authService.isLogged()) {
      const user = this.authService.getCurrentUserSession();

      if (user && user.expiration) {

        if (moment().unix() < user.expiration) {
          return true;
        } else {
          this.notificationService.openSnackBar('Your session has expired');
          this.dataService.logout().then( () =>{
            this.router.navigateByUrl('/auth/sign-in').then( () => {
              location.reload();
            });
          });
          return false;
        }
      }
    }
    this.notificationService.warn('Warning', 'You must be logged in');
    if(!(this.router.url.startsWith('/auth/') || this.router.url == '/home')) {
      this.router.navigate(['/auth/sign-in']).then( () => {});
    }
    return false;
  }
}
