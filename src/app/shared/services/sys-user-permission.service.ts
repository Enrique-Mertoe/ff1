import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {SysUserGroupPermission} from "../schema/sys-user-group-permission";
import {CrudService} from "./crud.service";

@Injectable({
  providedIn: 'root'
})
export class SysUserGroupPermissionService extends CrudService<SysUserGroupPermission> {
   constructor(apiService: ApiService) {
	super(apiService, '/sys-user-group-permissions', 'id');
  }
}
