import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {CrudService} from "./crud.service";
import {CoreDocumentCategory} from "../schema/core-document-category";

@Injectable({
  providedIn: 'root'
})
export class CoreDocumentCategoryService extends CrudService<CoreDocumentCategory> {
  constructor(apiService: ApiService) {
    super(apiService, '/document-categories', 'id');
  }
}
