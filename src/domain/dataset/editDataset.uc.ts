// domain/dataset/editDataset.uc.ts
import { createApiClient } from "@/api/client";
import type {
  Dataset,
  UpdateDatasetDto,
  EditDatasetOutputPort,
} from "./dataset.types";

// Typ dla pełnej odpowiedzi z API
interface DatasetApiResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  catalogId?: string;
  ownerId?: string;
  schema?: {
    id: string;
    title: string;
    description?: string;
  } | null;
  // ... inne pola
}

export default class EditDatasetUseCase {
  constructor(
    private readonly client: ReturnType<typeof createApiClient>,
    private readonly outputPort: EditDatasetOutputPort,
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

      const apiResponse = response.data as unknown as DatasetApiResponse;

      // Wyciągnij nazwę schemy z odpowiedzi
      const schemaName = apiResponse.schema?.title ?? null;

      // Mapuj na typ Dataset
      const dataset: Dataset = {
        id: apiResponse.id,
        title: apiResponse.title,
        description: apiResponse.description,
        status: apiResponse.status as Dataset["status"],
        catalogId: apiResponse.catalogId ?? "",
        ownerId: apiResponse.ownerId ?? "",
        schemaId: apiResponse.schema?.id ?? null,
      };

      this.outputPort.presentDataset(dataset, schemaName);

      return dataset;
    } catch (error) {
      this.outputPort.presentLoadDatasetError(error);
      throw error;
    }
  }

  async editDataset(id: string, dto: UpdateDatasetDto): Promise<void> {
    try {
      const response = await this.client.PUT("/api/datasets/{id}", {
        params: { path: { id } },
        body: dto,
      });

      if (response.error) {
        throw new Error("error/edit/dataset");
      }

      this.outputPort.presentEditDatasetSuccess();
    } catch (error) {
      this.outputPort.presentEditDatasetError(error);
      throw error;
    }
  }
}
