import {BaseEntity} from "./base-entity";
import {CoreLicenseApplication} from "./core-license-application";

export interface CoreLicense extends BaseEntity {
  dateIssued: Date;
  documentUrl: string;
  expirationDate: Date;
  licenseNumber: string;
  coreLicenseApplication: CoreLicenseApplication;
}
