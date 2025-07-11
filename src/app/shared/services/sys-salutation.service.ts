import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {SysSalutation} from "../schema/sys-salutation";
import {CrudService} from "./crud.service";

@Injectable({
  providedIn: 'root'
})
export class SysSalutationService extends CrudService<SysSalutation> {
   constructor(apiService: ApiService) {
	super(apiService, '/sys-salutations', 'id');
  }
}
