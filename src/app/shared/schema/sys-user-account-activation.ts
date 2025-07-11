import {SysUserAccount} from "./sys-user-account";
import {BaseEntity} from "./base-entity";

export interface SysUserAccountActivation extends BaseEntity {
  dateActivated: Date;
  dateExpired: Date;
  emailAddress: string;
  token: string;
  sysUserAccount: SysUserAccount;
}
