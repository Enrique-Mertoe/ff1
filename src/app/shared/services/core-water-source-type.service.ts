import { Injectable } from '@angular/core';
import {CoreWaterSourceType} from "../schema/core-water-source-type";
import {CrudService} from "./crud.service";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class CoreWaterSourceTypeService extends CrudService<CoreWaterSourceType> {
  constructor(apiService: ApiService) {
    super(apiService, '/water-source-types', 'id');
  }
}
