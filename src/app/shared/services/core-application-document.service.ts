import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {CoreApplicationDocument} from "../schema/core-application-document";
import {CrudService} from "./crud.service";

@Injectable({
  providedIn: 'root'
})
export class CoreApplicationDocumentService extends CrudService<CoreApplicationDocument> {
  constructor(apiService: ApiService) {
    super(apiService, '/application-documents', 'id');
  }
}
