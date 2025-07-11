import {BaseEntity} from "./base-entity";
import {SysUserAccount} from "./sys-user-account";
import {CoreApplicationStep} from "./core-application-step";
import {CoreApplicationStatus} from "./core-application-status";
import {CoreLicense} from "./core-license";
import {CoreLandRegime} from "./core-land-regime";
import {CoreLicenseType} from "./core-license-type";
import {CoreWaterSource} from "./core-water-source";

export interface CoreLicenseApplication extends BaseEntity {
  dateSubmitted: Date;
  destEasting: string;
  destHectarage: string;
  destNorthing: string;
  destOwnerFullname: string;
  destPlotNumber: string;
  destTa: string;
  destVillage: string;
  sourceEasting: string;
  sourceHectarage: string;
  sourceNorthing: string;
  sourceOwnerFullname: string;
  sourcePlotNumber: string;
  sourceTa: string;
  sourceVillage: string;
  coreWaterSource: CoreWaterSource;
  destLandRegime: CoreLandRegime;
  sourceLandRegime: CoreLandRegime;
  coreLicenseType: CoreLicenseType;
  currentLicense: CoreLicense;
  coreApplicationStatus: CoreApplicationStatus;
  coreApplicationStep: CoreApplicationStep;
  sysUserAccount: SysUserAccount;
  existingBoreholeCount: number;
  permitDuration: number;
  nearbyWaterUtilityBoard: string;
  altWaterSource: string;
  altOtherWater: string;
}
