import { Injectable } from '@angular/core';
import {CoreLicenseWaterUse} from "../schema/core-license-water-use";
import {CrudService} from "./crud.service";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class CoreLicenseWaterUseService extends CrudService<CoreLicenseWaterUse> {
  constructor(apiService: ApiService) {
    super(apiService, '/license-water-uses', 'id');
  }
}
