import {BaseEntity} from "./base-entity";

export interface SysEmailTemplate extends BaseEntity {
name: string;
status: number;
value: string;
}
