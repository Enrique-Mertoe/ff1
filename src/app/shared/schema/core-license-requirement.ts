import {BaseEntity} from "./base-entity";
import {CoreLicenseType} from "./core-license-type";

export interface CoreLicenseRequirement extends BaseEntity {
  name: string;
  description: string;
  coreLicenseType: CoreLicenseType;
}
