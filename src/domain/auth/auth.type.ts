import type { ID } from "../common.types";

export interface Me {
  userId: ID;
  roles: string[]; // e.g., "MetadataManager", "DataSupplier"
}

export interface LoginResponse {
  userId: ID;
}

export type Role =
  | "MetadataManager"
  | "AcquisitionAppManager"
  | "DataQualityManager"
  | "DataSupplier"
  | "DataUser"
  | "AccessAppDeveloper"
  | "Admin";
