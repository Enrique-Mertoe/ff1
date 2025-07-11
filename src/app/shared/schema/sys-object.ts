import {SysUserGroupPermission} from "./sys-user-group-permission";
import {BaseEntity} from "./base-entity";

export interface SysObject extends BaseEntity{
  description: string;
  name: string;
}
