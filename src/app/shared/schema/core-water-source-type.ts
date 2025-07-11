import {BaseEntity} from "./base-entity";

export interface CoreWaterSourceType extends BaseEntity {
  category: string;
  name: string;
  description: string;
}
