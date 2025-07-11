import {Inject, Injectable} from '@angular/core';
import {delay, map, of} from 'rxjs';
import {ApiService} from "./api.service";
import {DataService} from "./data.service";
import {Router} from "@angular/router";
import {NotificationService} from "./notification.service";
import {SysUserAccount} from "../schema/sys-user-account";
import {AccountCreateRequest} from "../schema/request-schema/account-create-request";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService, private dataService: DataService, private router: Router, private notificationService: NotificationService) {
  }

  async login(username: string, password: string, rememberMe: boolean = false) {
    return await this.apiService.api<any>('POST', '/auth/sign-in', {username, password, rememberMe});
  }
  isLogged() {
    return this.dataService.get('token') != null;
  }
  async register(data: AccountCreateRequest) {
    return await this.apiService.api<SysUserAccount>('POST', '/auth/sign-up', data);
  }
  async verifyToken(tokenx?: string) {
    const token = tokenx || localStorage.getItem('token');
    const res = await this.apiService.api('GET', '/auth/info');
    if(token) {
      this.setToken(token);
    }
  }
  async verifyPassword(username: string, password: string) {
    return await this.apiService.api<any>('POST', '/auth/sign-in', { username, password });
  }
  async getUserByUsername(username: string) {
    return await this.apiService.api<{username: string, exists: boolean}>('GET', `/auth/${username}/username`);
  }

  async getUserByEmailAddress(emailAddress: string) {
    return await this.apiService.api<{emailAddress: string, exists: boolean}>('GET', `/auth/${emailAddress}/email-address`);
  }
  async getUserBymMobileNumber(mobileNumber: string) {
    return await this.apiService.api<{mobileNumber: string, exists: boolean}>('GET', `/auth/${mobileNumber}/mobile-number`);
  }
  async confirmAccount(token: string) {
    return await this.apiService.api<SysUserAccount>('GET', `/auth/${token}/confirm-account`);
  }

  async requestPasswordReset(email: string) {
    return await this.apiService.api<SysUserAccount>('GET', `/auth/${email}/reset-password`);
  }

  setToken(token?: string, remember = true) {
    if (remember) {
      this.dataService.set('token', token);
    }
  }
  getToken() {
    return this.dataService.get('token');
  }
  logout(): void {
    // clear token remove user from local storage to log user out
    this.notificationService.coreConfirm('Confirm', 'You are about to log out').then( async result => {
        if (result) {
          this.dataService.logout().then( () =>{
            this.router.navigateByUrl('/auth/sign-in').then( () => {
              location.reload();
            });
          });
        }
      }
    );

  }

  getCurrentUser(): SysUserAccount {
    return this.dataService.get('userAccount');
  }

  passwordResetRequest(email: string) {
    return of(true).pipe(delay(1000));
  }

  changePassword(email: string, currentPwd: string, newPwd: string) {
    return of(true).pipe(delay(1000));
  }

  passwordReset(email: string, token: string, password: string, confirmPassword: string): any {
    return of(true).pipe(delay(1000));
  }

  getCurrentUserSession() {
    if (!this.isLogged()) {
      return null;
    }
    const token = this.dataService.get('token');
    const decodeToken: any = jwtDecode(token);
    return {expiration: decodeToken?.exp, userAccount: this.dataService.get('userAccount')};
  }
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.sysUserGroup?.name ==='admin';
  }
}
