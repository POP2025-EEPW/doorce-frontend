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

export interface CreateDatasetCommentDto {
  content: string;
  priority: number;
}

export interface SetQualityTagDto {
  qualityTag: string;
}
