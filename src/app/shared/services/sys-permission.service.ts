import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {SysPermission} from "../schema/sys-permission";
import {CrudService} from "./crud.service";

@Injectable({
  providedIn: 'root'
})
export class SysPermissionService extends CrudService<SysPermission> {
   constructor(apiService: ApiService) {
	super(apiService, '/sys-permissions', 'id');
  }
}
