import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {CrudService} from "./crud.service";
import {CoreCustomer} from "../schema/core-customer";

@Injectable({
  providedIn: 'root'
})
export class CoreCustomerService extends CrudService<CoreCustomer> {
  constructor(apiService: ApiService) {
    super(apiService, '/customers', 'id');
  }
}
