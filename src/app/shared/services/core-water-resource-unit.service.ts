import { Injectable } from '@angular/core';
import {CoreWaterResourceUnit} from "../schema/core-water-resource-unit";
import {CrudService} from "./crud.service";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class CoreWaterResourceUnitService extends CrudService<CoreWaterResourceUnit> {
  constructor(apiService: ApiService) {
    super(apiService, '/water-resource-units', 'id');
  }
  async getByArea(id: string) {
    return await this.apiService.api<CoreWaterResourceUnit[]>('GET', `${this.path}/${id}/area`);
  }
}
