import { Injectable } from '@angular/core';
import {CoreLicenseTypeActivity} from "../schema/core-license-type-activity";
import {CrudService} from "./crud.service";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class CoreLicenseTypeActivityService extends CrudService<CoreLicenseTypeActivity> {
  constructor(apiService: ApiService) {
    super(apiService, '/license-type-activities', 'id');
  }
}
