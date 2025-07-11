import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {CrudService} from "./crud.service";
import {CoreLicense} from "../schema/core-license";

@Injectable({
  providedIn: 'root'
})
export class CoreLicenseService extends CrudService<CoreLicense> {
  constructor(apiService: ApiService) {
    super(apiService, '/licenses', 'id');
  }
}
