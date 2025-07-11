import {SysUserGroupPermission} from "./sys-user-group-permission";
import {BaseEntity} from "./base-entity";

export interface SysPermission extends BaseEntity{
  description: string;
  name: string;
}
