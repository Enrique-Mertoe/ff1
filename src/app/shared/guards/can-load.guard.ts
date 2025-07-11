import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth.service";
import {MenuService} from "../services/menu.service";
import {NotificationService} from "../services/notification.service";

@Injectable({
  providedIn: 'root'
})
export class CanLoadGuard implements CanActivateChild {
  constructor(    private router: Router,
                  private authService: AuthService,
                  private notificationService: NotificationService,
                  private menuService: MenuService,
                  ) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if(this.menuService.menus.length === 0) {
    //   this.menuService.generate();
    // }
    const hasAccess = this.menuService.paths.includes(state.url);
    if( !hasAccess) {
      this.router.navigateByUrl(this.menuService.paths[0] || '/dashboard').then( () => {
        this.notificationService.warn('Access denied.', 'Restricted object');
      });
    }
    return true;
  }

}
