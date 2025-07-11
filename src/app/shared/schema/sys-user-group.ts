import {BaseEntity} from "./base-entity";

export interface SysUserGroup extends BaseEntity {
  description: string;
  name: string;
}
