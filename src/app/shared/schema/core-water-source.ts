import {BaseEntity} from "./base-entity";
import {CoreWaterSourceType} from "./core-water-source-type";

export interface CoreWaterSource extends BaseEntity {
  coreWaterSourceType: CoreWaterSourceType;
  name: string;
  description: string;
}
