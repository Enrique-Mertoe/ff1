import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {CoreLicenseRequirement} from "../schema/core-license-requirement";
import {CrudService} from "./crud.service";

@Injectable({
  providedIn: 'root'
})
export class CoreLicenseRequirementService extends CrudService<CoreLicenseRequirement> {
  constructor(apiService: ApiService) {
    super(apiService, '/license-requirements', 'id');
  }

  async getByLicenseType(id: string) {
    return await this.apiService.api<CoreLicenseRequirement[]>('GET', `${this.path}/${id}/license-type`);
  }
}
