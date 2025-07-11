import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {DataService} from "./data.service";
import {SysUserAccount} from "../schema/sys-user-account";
import {CrudService} from "./crud.service";

@Injectable({
  providedIn: 'root'
})
export class SysUserAccountService extends CrudService<SysUserAccount> {
   constructor(apiService: ApiService) {
	super(apiService, '/sys-user-accounts', 'id');
  }
  async getUserByUsername(username: string) {
    return await this.apiService.api<SysUserAccount>('GET', `/sys-user-accounts/${username}/username`);
  }

  async getUserByEmailAddress(emailAddress: string) {
    return await this.apiService.api<SysUserAccount>('GET', `/sys-user-accounts/${emailAddress}/email_address`);
  }
}
