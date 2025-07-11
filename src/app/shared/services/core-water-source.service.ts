import { Injectable } from '@angular/core';
import {CoreWaterSource} from "../schema/core-water-source";
import {CrudService} from "./crud.service";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class CoreWaterSourceService extends CrudService<CoreWaterSource> {
  constructor(apiService: ApiService) {
    super(apiService, '/water-sources', 'id');
    console.log('=== WATER SOURCE SERVICE INITIALIZED ===');
    console.log('Base endpoint:', '/water-sources');
  }
  async getByType(waterSourceTypeId: string): Promise<any[]> {
    try {
      const response = await fetch(`http://localhost:8080/api/nwra-apis/ewaterpermit-ws/v1/water-sources/${waterSourceTypeId}/type`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching water sources by type:', error);
      throw error;
    }
  }
}
