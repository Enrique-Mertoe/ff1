import {Inject, Injectable} from '@angular/core';
import {ApiService} from "./api.service";
import {SearchResponse} from "../schema/response-schema/search-response";

@Injectable({
  providedIn: 'root'
})
export class CrudService<T> {

  constructor(public apiService: ApiService, @Inject(String) public path: string, @Inject(String) public idColumn: string) { }
  async create(data: Partial<T>): Promise<T> {
    return await this.apiService.api<T>('POST', `${this.path}`, data);
  }
  async update(data: Partial<T>): Promise<T> {
    return await this.apiService.api<T>('PUT', `${this.path}/${data[this.idColumn]}`, data);
  }
  async delete(id: string): Promise<any>;
  async delete(obj: Partial<T>): Promise<any>;
  async delete(param: string | Partial<T>): Promise<any> {
    let id:any;
    if (typeof param === 'string') {
      id = param;
    } else {
      id = param[this.idColumn];
    }
    return await this.apiService.api<any>('DELETE', `${this.path}/${id}`);
  }

  //overload getAll
  async getAll(): Promise<T[]>;
  async getAll(currentPage: number, pageSize?: number, query?: string): Promise<SearchResponse>;
  async getAll(currentPage?: number, pageSize: number = 10, query: string=''): Promise<SearchResponse | T[]> {
    if(currentPage || currentPage == 0) {
      // 0 is false. just checking currentPage won't work
      return await this.apiService.api<SearchResponse>('GET', `${this.path}?page=${currentPage}&limit=${pageSize}&query=${query}`);
    } else {
      return await this.apiService.api<T[]>('GET', `${this.path}`);
    }
  }
  async getById(id: string): Promise<T> {
    return await this.apiService.api<T>('GET', `${this.path}/${id}`);
  }
}
