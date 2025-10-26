import type { ID, ISODateString } from "./common";

// Catalogs

export interface CatalogSummary {
  id: ID;
  title: string;
  description?: string;
  parentCatalogId: ID | null;
}

export interface Catalog extends CatalogSummary {
  // for tree UIs; backend may or may not return children
  children?: CatalogSummary[];
}

export interface CreateCatalogInput {
  title: string;
  description?: string;
  parentCatalogId: ID | null;
}

// Dataset core

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

export interface CreateDatasetInput {
  title: string;
  description?: string;
  catalogId: ID;
  ownerId: ID;
}

export interface UpdateDatasetInput {
  title?: string;
  description?: string;
  status?: DatasetStatus;
  catalogId?: ID;
  schemaId?: ID | null;
}

// Listing and filters (Group 2)

export interface DatasetFilter {
  text?: string; // free text across title/description
  catalogId?: ID;
  ownerId?: ID;
  status?: DatasetStatus;
  schemaId?: ID | null;
}

// Descriptions and previews (Groups 2–3)

export interface DatasetDescription {
  id: ID;
  title: string;
  description?: string;
  ownerName?: string;
  schemaName?: string;
  status: DatasetStatus;
  fields?: DatasetField[];
}

export interface DatasetField {
  name: string;
  type:
    | "integer"
    | "number"
    | "boolean"
    | "string"
    | "date"
    | "datetime"
    | "geojson"
    | "object"
    | "array";
  required?: boolean;
  public?: boolean; // for API exposure
}

// Data entries (Group 3)

export type DataEntryId = ID;

export interface DataEntry {
  id: DataEntryId;
  datasetId: ID;
  // schema-conforming payload; JSON object per entry
  payload: Record<string, unknown>;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface CreateDataEntryInput {
  // datasetId provided by path
  payload: Record<string, unknown>;
}

export interface EditDataEntryInput {
  payload: Record<string, unknown>;
}

// Dataset preview (Group 3)

export interface DatasetPreview {
  datasetId: ID;
  columns: string[]; // derived from schema/public fields
  rows: unknown[][]; // limited sample rows
  totalSampled: number;
}

// Raw data stubs for Group 4 (kept here for cohesion; implement later)

export interface RawSource {
  kind: "upload" | "s3" | "http";
  uri?: string;
  notes?: string;
}

export interface RawDatasetDescriptor {
  id: ID;
  datasetId: ID;
  source: RawSource;
  createdAt: ISODateString;
}

export interface RawBatch {
  id: ID;
  receivedAt: ISODateString;
  sizeBytes: number;
  checksum?: string;
}

export interface DownloadToken {
  url: string;
  expiresAt: ISODateString;
}

export type AvailabilityStatus = "up" | "down" | "degraded";
