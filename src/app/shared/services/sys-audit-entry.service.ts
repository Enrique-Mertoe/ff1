import { Injectable } from '@angular/core';
import {CrudService} from "./crud.service";
import {SysAuditEntry} from "../schema/sys-audit-entry";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class SysAuditEntryService extends CrudService<SysAuditEntry>{

  constructor(api: ApiService) {
    super(api, '/sys-audits', 'id');
  }
}
