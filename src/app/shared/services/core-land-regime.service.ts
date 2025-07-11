import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {CrudService} from "./crud.service";
import {CoreLandRegime} from "../schema/core-land-regime";

@Injectable({
  providedIn: 'root'
})
export class CoreLandRegimeService extends CrudService<CoreLandRegime> {
  constructor(apiService: ApiService) {
    super(apiService, '/land-regimes', 'id');
  }
}
