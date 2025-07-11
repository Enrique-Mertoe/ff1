import {BaseEntity} from "./base-entity";
import {CoreLicenseApplication} from "./core-license-application";
import {SysUserAccount} from "./sys-user-account";

export interface CoreLicenseApplicationActivity extends BaseEntity {
  coreLicenseApplication:	CoreLicenseApplication;
  sysUserAccount: SysUserAccount;
  coreLicenseTypeActivity: CoreLicenseTypeActivity;
  description: string;
}
