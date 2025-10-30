import type { ID } from "./common";

export interface Me {
  userId: ID;
  roles: string[]; // e.g., "MetadataManager", "DataSupplier"
}

export interface LoginResponse {
  userId: ID;
}

export type Role =
  | "Admin"
  | "MetadataManager"
  | "DataQualityManager"
  | "DataSupplier";
