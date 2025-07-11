import {BaseEntity} from "./base-entity";

export interface CoreWaterResourceArea extends BaseEntity {
  geoGeometry: string;
  geoProperty: string;
  geoType: string;
}
