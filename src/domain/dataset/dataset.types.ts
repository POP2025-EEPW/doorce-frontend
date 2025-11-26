import type { ID, ISODateString } from "../common.types";

export type DatasetStatus = "draft" | "published" | "archived";

export interface DatasetSummary {
  id: ID;
  title: string;
  description?: string;
  status: DatasetStatus;
  catalogId: ID;
}

export interface Dataset extends DatasetSummary {
  ownerId: ID; // door:DataOwner
  schemaId?: ID | null;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface CreateDatasetDto {
  title: string;
  description: string;
  qualityControllable: boolean;
  schemaId: string;
}

export interface UpdateDatasetDto {
  title: string;
  description: string;
  status: DatasetStatus;
  catalogId: ID;
  schemaId: ID | null;
}

export interface DatasetFilter {
  text?: string; // free text across title/description
  catalogId?: ID;
  ownerId?: ID;
  status?: DatasetStatus;
  schemaId?: ID | null;
}

export interface DatasetDescription {
  description?: string;
}

export interface DataEntryPreview {
  id: ID;
  content: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface DatasetPreview {
  datasetId: ID;
  title: string;
  description: string;
  entryCount: number;
  sampleEntries: DataEntryPreview[];
}
