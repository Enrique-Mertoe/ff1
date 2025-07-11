import {BaseEntity} from "./base-entity";
import {CoreLicenseApplication} from "./core-license-application";
import {CoreWaterUse} from "./core-water-use";

export interface CoreLicenseWaterUse extends BaseEntity {
  amountPerDayM3: number;
  description: string;
  coreWaterUse: CoreWaterUse;
  coreLicenseApplication: CoreLicenseApplication;
}
