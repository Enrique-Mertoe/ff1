import { Injectable } from '@angular/core';
import {CoreTraditionalAuthority} from "../schema/core-traditional-authority";
import {CrudService} from "./crud.service";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class CoreTraditionalAuthorityService extends CrudService<CoreTraditionalAuthority> {
  constructor(apiService: ApiService) {
    super(apiService, '/traditional-authorities', 'id');
  }
}
