import { Injectable } from '@angular/core';
import {CoreWaterResourceArea} from "../schema/core-water-resource-area";
import {CrudService} from "./crud.service";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class CoreWaterResourceAreaService extends CrudService<CoreWaterResourceArea> {
  constructor(apiService: ApiService) {
    super(apiService, '/water-resource-areas', 'id');
  }
}
