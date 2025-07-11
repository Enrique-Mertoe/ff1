import {SysUserAccount} from "./sys-user-account";
import {BaseEntity} from "./base-entity";

export interface SysAuditEntry extends BaseEntity{
  action: string;
  fieldName: string;
  keyValue: string;
  newValue: string;
  oldValue: string;
  tableName: string;
  sysUserAccount: SysUserAccount;
}
