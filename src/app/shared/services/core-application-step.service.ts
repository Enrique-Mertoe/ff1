import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {CrudService} from "./crud.service";
import {CoreApplicationStep} from "../schema/core-application-step";

@Injectable({
  providedIn: 'root'
})
export class CoreApplicationStepService extends CrudService<CoreApplicationStep> {
  constructor(apiService: ApiService) {
    super(apiService, '/application-steps', 'id');
  }
}
