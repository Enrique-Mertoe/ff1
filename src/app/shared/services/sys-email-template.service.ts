import { Injectable } from '@angular/core';
import {SysEmailTemplate} from "../schema/sys-email-template";
import {ApiService} from "./api.service";
import {CrudService} from "./crud.service";

@Injectable({
  providedIn: 'root'
})
export class SysEmailTemplateService extends CrudService<SysEmailTemplate> {
   constructor(apiService: ApiService) {
	super(apiService, '/sys-email-templates', 'ids');
  }
}
