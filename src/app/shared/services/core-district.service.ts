import { Injectable } from '@angular/core';
import {CoreDistrict} from "../schema/core-district";
import {CrudService} from "./crud.service";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class CoreDistrictService extends CrudService<CoreDistrict> {
  constructor(apiService: ApiService) {
    super(apiService, '/districts', 'id');
  }
}
