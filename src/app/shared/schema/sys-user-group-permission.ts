import {SysPermission} from "./sys-permission";
import {SysUserGroup} from "./sys-user-group";
import {SysObject} from "./sys-object";
import {BaseEntity} from "./base-entity";

export interface SysUserGroupPermission extends BaseEntity {
  sysPermission: SysPermission;
  sysUserGroup: SysUserGroup;
  sysObject: SysObject;
}
