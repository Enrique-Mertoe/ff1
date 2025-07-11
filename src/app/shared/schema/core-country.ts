import {BaseEntity} from "./base-entity";

export interface CoreCountry extends BaseEntity {
  iso: string;

  iso3: string;

  name: string;

  nicename: string;

  numcode: string;

  phonecode: string;
}
