import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {CrudService} from "./crud.service";
import {CoreCustomerType} from "../schema/core-customer-type";

@Injectable({
  providedIn: 'root'
})
export class CoreCustomerTypeService extends CrudService<CoreCustomerType> {
  constructor(apiService: ApiService) {
    super(apiService, '/customer-types', 'id');
  }
}
