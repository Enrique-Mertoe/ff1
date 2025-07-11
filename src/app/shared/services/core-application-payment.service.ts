import { Injectable } from '@angular/core';
import {CrudService} from "./crud.service";
import {CoreApplicationDocument} from "../schema/core-application-document";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class CoreApplicationPaymentService extends CrudService<CoreApplicationDocument> {
  constructor(apiService: ApiService) {
    super(apiService, '/application-payments', 'id');
  }
}
