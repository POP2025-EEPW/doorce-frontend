import type { ID, ISODateString } from "../common.types";

export interface DatasetComment {
  id: ID;
  datasetId: ID;
  authorId: ID;
  authorUsername: string;
  content: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface QualityValidityAlert {
  id: ID;
  datasetId: ID;
  datasetTitle: string;
  alertType: string;
  message: string;
  severity: string;
  createdAt: ISODateString;
  resolved: boolean;
}

export interface CreateDatasetCommentDto {
  content: string;
  priority: number;
}

export interface SetQualityTagDto {
  qualityTag: string;
}

export interface QualityOutputPort {
  // Set quality tag
  presentSetQualityTagSuccess(): void;
  presentSetQualityTagError(error: unknown): void;

  // Add comment
  presentAddCommentSuccess(): void;
  presentAddCommentError(error: unknown): void;

  // Load comments
  presentComments(comments: DatasetComment[]): void;
  presentLoadCommentsError(error: unknown): void;
}
