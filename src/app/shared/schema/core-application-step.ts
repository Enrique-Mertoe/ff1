import {BaseEntity} from "./base-entity";

export interface CoreApplicationStep extends BaseEntity {
  name: string;
  description: string;
  sequenceNumber: number;
}
