import {BaseEntity} from "./base-entity";

export interface SysConfig extends BaseEntity {
  availableLang: string;
  baseLang: string;
  contactEmailAddress: string;
  contactPhone: string;
  contactFax: string;
  contactPhysicalAddress: string;
  contactPostalAddress: string;
  customCss: string;
  dateDeactivated: Date;
  favicon: string;
  lockUserMaximumAttempts: number;
  lockUserTime: number;
  notFoundImage: string;
  registerUserOnEmailFailure: string;
  storageUrl: string;
  systemDescription: string;
  systemDisclaimer: string;
  systemEmailAddress: string;
  systemEmailAuth: string;
  systemEmailPort: number;
  systemEmailSmtp: string;
  systemEmailSmtpSecurity: string;
  systemLogoUrl: string;
  systemName: string;
  systemNameFull: string;
  systemUrl: string;
  uploadDirectory: string;
  userSessionTimeout: number;
}
