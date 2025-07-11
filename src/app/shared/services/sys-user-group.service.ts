import { Injectable } from '@angular/core';
import {SysUserGroup} from "../schema/sys-user-group";
import {ApiService} from "./api.service";
import {CrudService} from "./crud.service";

@Injectable({
  providedIn: 'root'
})
export class SysUserGroupService extends CrudService<SysUserGroup> {
   constructor(apiService: ApiService) {
	super(apiService, '/sys-user-groups', 'id');
  }
}
