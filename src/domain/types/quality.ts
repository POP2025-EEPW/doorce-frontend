import type { ID, ISODateString } from "./common";

// Comments (Groups 2–3)

export interface DatasetComment {
  id: ID;
  datasetId: ID;
  text: string;
  createdAt: ISODateString;
  createdBy: ID; // userId
}

export interface CreateDatasetCommentInput {
  text: string;
}

// Data-related requests (Group 3)

export type DataRelatedRequestStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed";

export interface DataRelatedRequest {
  id: ID;
  title: string;
  description: string;
  createdAt: ISODateString;
  createdBy: ID;
  status: DataRelatedRequestStatus;
}

export interface CreateDataRelatedRequestInput {
  title: string;
  description: string;
}

export interface DataRelatedRequestFilter {
  status?: DataRelatedRequestStatus;
  createdBy?: ID;
}

// Quality tags and alerts (Group 5 – definitions ready now)

export interface QualityTag {
  id: ID;
  label: "Bronze" | "Silver" | "Gold" | string;
  score?: number; // 0..100
  updatedAt: ISODateString;
  updatedBy?: ID;
}

export type QualityAlertSeverity = "info" | "warning" | "error";

export interface QualityValidityAlert {
  id: ID;
  datasetId: ID;
  severity: QualityAlertSeverity;
  message: string;
  createdAt: ISODateString;
}
