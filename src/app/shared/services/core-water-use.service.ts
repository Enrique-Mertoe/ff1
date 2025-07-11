import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {CoreWaterUse} from "../schema/core-water-use";
import {CrudService} from "./crud.service";

@Injectable({
  providedIn: 'root'
})
export class CoreWaterUseService extends CrudService<CoreWaterUse> {
  constructor(apiService: ApiService) {
    super(apiService, '/water-uses', 'id');
  }
}
