import {BaseEntity} from "./base-entity";
import {CoreLicenseType} from "./core-license-type";
import {YesNo} from "./yes-no";

export interface CoreLicenseTypeActivity extends BaseEntity {
  coreLicenseType: CoreLicenseType;
  description: string;
  name: string;
  isUserActivity: YesNo;
  isRequired: YesNo;
  isUpload: YesNo;
}

