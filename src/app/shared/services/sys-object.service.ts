import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {SysObject} from "../schema/sys-object";
import {CrudService} from "./crud.service";

@Injectable({
  providedIn: 'root'
})
export class SysObjectService extends CrudService<SysObject> {
   constructor(apiService: ApiService) {
	super(apiService, '/sys-objects', 'id');
  }
}
