import { Injectable } from '@angular/core';
import {CoreLicenseType} from "../schema/core-license-type";
import {CrudService} from "./crud.service";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class CoreLicenseTypeService extends CrudService<CoreLicenseType> {
  constructor(apiService: ApiService) {
    super(apiService, '/license-types', 'id');
  }
}
