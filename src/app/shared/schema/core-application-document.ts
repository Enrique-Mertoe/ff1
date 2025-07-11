import {BaseEntity} from "./base-entity";
import {CoreDocumentCategory} from "./core-document-category";
import {CoreLicenseApplication} from "./core-license-application";

export interface CoreApplicationDocument extends BaseEntity {
  documentUrl: string;
  coreLicenseApplication: CoreLicenseApplication;
  coreDocumentCategory: CoreDocumentCategory;
}
