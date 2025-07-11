import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {SysAccountStatus} from "../schema/sys-account-status";
import {CrudService} from "./crud.service";

@Injectable({
  providedIn: 'root'
})
export class SysAccountStatusService extends CrudService<SysAccountStatus> {
   constructor(apiService: ApiService) {
	super(apiService, '/sys-account-statuses', 'id');
  }
}
