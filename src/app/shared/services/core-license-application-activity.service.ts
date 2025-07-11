import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {CrudService} from "./crud.service";
import {CoreLicenseApplicationActivity} from "../schema/core-license-application-activity";

@Injectable({
  providedIn: 'root'
})
export class CoreLicenseApplicationActivityService extends CrudService<CoreLicenseApplicationActivity> {
  constructor(apiService: ApiService) {
    super(apiService, '/license-application-activities', 'id');
  }
}
