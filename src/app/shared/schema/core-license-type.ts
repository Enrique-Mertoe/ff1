import {BaseEntity} from "./base-entity";

export interface CoreLicenseType extends BaseEntity {
  applicationFees: number;
  defaultValidityLength: number;
  description: string;
  licenseFees: number;
  name: string;
  status: number;
}
