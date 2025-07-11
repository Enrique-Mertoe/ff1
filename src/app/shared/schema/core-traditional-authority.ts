import {BaseEntity} from "./base-entity";
import {CoreDistrict} from "./core-district";

export interface CoreTraditionalAuthority extends BaseEntity {
  name: string;
  coreDistrict: CoreDistrict;
}
