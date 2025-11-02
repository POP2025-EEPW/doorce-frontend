import type { ID } from "../common.types";

export interface DatasetComment {
  id: ID;
  content: string;
  priority: number;
}

export interface CreateDatasetCommentDto {
  content: string;
  priority: number;
}
