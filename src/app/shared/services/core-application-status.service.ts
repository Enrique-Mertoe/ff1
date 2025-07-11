import { Injectable } from '@angular/core';
import {CoreApplicationPayment} from "../schema/core-application-payment";
import {CrudService} from "./crud.service";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class CoreApplicationStatusService extends CrudService<CoreApplicationPayment> {
  constructor(apiService: ApiService) {
    super(apiService, '/application-status', 'id');
  }
}
