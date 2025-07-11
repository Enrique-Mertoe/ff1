import {BaseEntity} from "./base-entity";
import {CoreDistrict} from "./core-district";
import {SysSalutation} from "./sys-salutation";
import {SysAccountStatus} from "./sys-account-status";
import {SysUserGroup} from "./sys-user-group";
import {CoreCountry} from "./core-country";
import {CoreCustomerType} from "./core-customer-type";

export interface SysUserAccount extends BaseEntity {
  canLoginAfter: Date;
  emailAddress: string;
  firstName: string;
  gender: string;
  lang: string;
  lastLogin: Date;
  lastName: string;
  lastPasswordAttempt: Date;
  middleName: string;
  nickName: string;
  password: string;
  passwordAttemptCount: number;
  phoneNumber: string;
  postalAddress: string;
  profilePhoto: string;
  username: string;
  sysUserGroup: SysUserGroup;
  sysAccountStatus: SysAccountStatus;
  sysSalutation: SysSalutation;
  coreDistrict: CoreDistrict;

  coreCustomerType: CoreCustomerType;
  coreCountry: CoreCountry;
  nationalId: string;
  passportNumber: string;
  designation: string;
  companyRegistrationNumber: string;
  companyRegisteredName: string;
  companyTradingName: string;
}
