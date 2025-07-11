import {BaseEntity} from "./base-entity";
import {CoreWaterResourceArea} from "./core-water-resource-area";

export interface CoreWaterResourceUnit extends BaseEntity {
  geoGeometry: string;
  geoProperty: string;
  geoType: string;
  coreWaterResourceArea: CoreWaterResourceArea;
}
