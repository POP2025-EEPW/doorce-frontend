import type { Dataset } from "@/domain/dataset/dataset.types.ts";

export interface DataSchema {
  id: string;
  name: string;
  description?: string;
  version?: string;
}

export interface SetDatasetSchemaOutputPort {
  presentDataset(dataset: Dataset): void;
  presentLoadDatasetError(error: unknown): void;
  presentSchemas(schemas: DataSchema[]): void;
  presentLoadSchemasError(error: unknown): void;
  presentSetSchemaSuccess(): void;
  presentSetSchemaError(error: unknown): void;
}
