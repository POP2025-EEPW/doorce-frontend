// domain/schema/setDatasetSchema.uc.ts
import { createApiClient } from "@/api/client";
import type { Dataset } from "@/domain/dataset/dataset.types";
import type { DataSchema } from "./schema.type";
import type { SetDatasetSchemaOutputPort } from "./schema.type.ts";
import mockSchemas from "@/mocks/schemas.json";

export default class SetDatasetSchemaUseCase {
  // Temporary mock data - remove when backend is ready
  private mockSchemas: DataSchema[] = mockSchemas;

  constructor(
    private readonly client: ReturnType<typeof createApiClient>,
    private readonly outputPort: SetDatasetSchemaOutputPort,
  ) {}

  async loadDataset(id: string): Promise<Dataset> {
    try {
      const response = await this.client.GET("/api/datasets/{id}", {
        params: { path: { id } },
      });

      if (response.error) {
        throw new Error("error/get/dataset");
      }

      if (!response.data) {
        throw new Error("no-data/get/dataset");
      }

      const dataset = response.data as unknown as Dataset;

      this.outputPort.presentDataset(dataset);

      return dataset;
    } catch (error) {
      this.outputPort.presentLoadDatasetError(error);
      throw error;
    }
  }

  async loadSchemas(): Promise<DataSchema[]> {
    try {
      // TODO: Replace with real API call when backend is ready
      // const response = await this.client.GET("/api/v1/schemas");
      // if (!response.data) {
      //   throw new Error("error/load/schemas");
      // }
      // const schemas = response.data;

      // Mock implementation with artificial delay
      const schemas = await new Promise<DataSchema[]>((resolve) => {
        setTimeout(() => {
          resolve([...this.mockSchemas]);
        }, 500);
      });

      this.outputPort.presentSchemas(schemas);

      return schemas;
    } catch (error) {
      this.outputPort.presentLoadSchemasError(error);
      throw error;
    }
  }

  async setSchema(datasetId: string, schemaId: string | null): Promise<void> {
    try {
      const response = await this.client.PUT("/api/datasets/{id}/schema", {
        params: {
          path: { id: datasetId },
        },
        body: {
          id: schemaId ?? undefined,
        },
      });

      if (!response.response.ok) {
        throw new Error("error/set/schema");
      }

      this.outputPort.presentSetSchemaSuccess();
    } catch (error) {
      this.outputPort.presentSetSchemaError(error);
      throw error;
    }
  }
}
