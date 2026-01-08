// domain/schema/setDatasetSchema.uc.ts
import type { createApiClient } from "@/api/client";
import type {
  SetDatasetSchemaOutputPort,
  SchemaDto,
  DataSchema,
} from "./schema.type";
import { mapSchemaDtoToDomain } from "./schema.type";
import type { Dataset } from "@/domain/dataset/dataset.types";

export default class SetDatasetSchemaUseCase {
  constructor(
    private readonly client: ReturnType<typeof createApiClient>,
    private readonly presenter: SetDatasetSchemaOutputPort,
  ) {}

  async loadDataset(datasetId: string): Promise<Dataset> {
    try {
      const response = await this.client.GET("/api/datasets/{id}", {
        params: { path: { id: datasetId } },
      });

      if (response.error) {
        throw new Error("error/get/dataset");
      }

      if (!response.data) {
        throw new Error("no-data/get/dataset");
      }

      const dataset = response.data as unknown as Dataset;
      this.presenter.presentDataset(dataset);
      return dataset;
    } catch (error) {
      this.presenter.presentLoadDatasetError(error);
      throw error;
    }
  }

  async loadSchemas(): Promise<DataSchema[]> {
    try {
      const response = await this.client.GET("/api/schemas");

      if (response.error) {
        throw new Error("error/load/schemas");
      }

      if (!response.data) {
        throw new Error("error/load/schemas");
      }

      const dtos = response.data as unknown as SchemaDto[];
      const schemas = dtos.map(mapSchemaDtoToDomain);

      this.presenter.presentSchemas(schemas);
      return schemas;
    } catch (error) {
      this.presenter.presentLoadSchemasError(error);
      throw error;
    }
  }

  async setSchema(datasetId: string, schemaId: string | null): Promise<void> {
    try {
      // Based on the OpenAPI spec, the endpoint expects a Schema object in the body
      // but for setting schema reference, we send just the id
      const response = await this.client.PUT("/api/datasets/{id}/schema", {
        params: { path: { id: datasetId } },
        body: {
          id: schemaId ?? undefined,
        },
      });

      if (!response.response.ok) {
        throw new Error("error/set/schema");
      }

      this.presenter.presentSetSchemaSuccess();
    } catch (error) {
      this.presenter.presentSetSchemaError(error);
      throw error;
    }
  }

  async removeSchema(datasetId: string): Promise<void> {
    return this.setSchema(datasetId, null);
  }
}
