import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth.service";
import {MenuService} from "../services/menu.service";
import {NotificationService} from "../services/notification.service";

@Injectable({
  providedIn: 'root'
})
export class CanAccessGuard implements CanActivate {
  constructor(    private router: Router,
                  private authService: AuthService,
                  private menuService: MenuService,
                  private notificationService: NotificationService,
  ) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.menuService.menus.length === 0) {
      this.menuService.generate();
    }
    const hasAccess = this.menuService.paths.includes(state.url);
    if(hasAccess) {
      return true;
    }
    const path = state.url.includes('edit')? '/edit' : state.url.includes('create')? '/create': state.url.includes('details')? '/details': '';
    if (path.trim().length > 0 && this.menuService.paths.includes(state.url.split(path.trim())[0])) {
      return true;
    }
    this.router.navigateByUrl(this.menuService.paths[0] || '/dashboard').then( () => {
      this.notificationService.warn('Access denied.', 'Restricted object');
    });
    return false;
  }

}
