import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {CrudService} from "./crud.service";
import {CoreFeesType} from "../schema/core-fees-type";

@Injectable({
  providedIn: 'root'
})
export class CoreFeesTypeService extends CrudService<CoreFeesType> {
  constructor(apiService: ApiService) {
    super(apiService, '/fees-types', 'id');
  }
}
