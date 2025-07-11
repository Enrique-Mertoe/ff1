import {BaseEntity} from "./base-entity";
import {CoreLicenseApplication} from "./core-license-application";
import {CoreFeesType} from "./core-fees-type";

export interface CoreApplicationPayment extends BaseEntity {
  amountPaid: number;
  coreLicenseApplication: CoreLicenseApplication;
  coreFeesType: CoreFeesType;
}
