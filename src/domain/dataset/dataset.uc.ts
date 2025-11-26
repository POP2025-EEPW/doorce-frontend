import { createApiClient } from "@/api/client";
import type {
  CreateDatasetDto,
  Dataset,
  DatasetDescription,
  DatasetFilter,
  DatasetSummary,
  UpdateDatasetDto,
} from "./dataset.types";
import datasets from "@/mocks/datasets.json";

export default class DatasetUseCase {
  constructor(private readonly client: ReturnType<typeof createApiClient>) {}

  async addDataset(input: CreateDatasetDto): Promise<void> {
    const response = await this.client.POST("/api/datasets", {
      body: input,
    });

    if (response.error) {
      throw new Error("error/add/dataset");
    }
  }

  async editDataset(id: string, dataset: UpdateDatasetDto): Promise<void> {
    const response = await this.client.PUT("/api/datasets/{id}", {
      params: { path: { id } },
      body: dataset,
    });

    if (response.error) {
      throw new Error("error/edit/dataset");
    }
  }

  async getDataset(id: string): Promise<Dataset> {
    const response = await this.client.GET("/api/datasets/{id}", {
      params: { path: { id } },
    });

    if (response.error) {
      throw new Error("error/get/dataset");
    }

    if (!response.data) {
      throw new Error("no-data/get/dataset");
    }

    //TODO: Consult with backend about bad reutrns
    const result = response.data as unknown as Dataset;

    return result;
  }

  async setSchema(datasetId: string, schemaId: string | null): Promise<void> {
    const response = await this.client.PUT("/api/datasets/{id}/schema", {
      params: {
        path: { id: datasetId },
      },
      body: {
        id: schemaId ?? undefined,
      },
    });

    if (!response.response.ok) {
      throw new Error("Failed to set dataset schema");
    }
  }

  async listDatasets(
    filter?: DatasetFilter,
    page = 1,
    pageSize = 10,
  ): Promise<DatasetSummary[]> {
    const result = datasets as Dataset[];

    const filtered = result.filter((item) => {
      const matchesCatalog = filter?.catalogId
        ? item.catalogId === filter.catalogId
        : true;
      const matchesStatus = filter?.status
        ? item.status === filter.status
        : true;
      return matchesCatalog && matchesStatus;
    });

    const startIndex = (page - 1) * pageSize;
    const pagedResults = filtered.slice(startIndex, startIndex + pageSize);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(pagedResults);
      }, 1000);
    });
  }

  async getDatasetDescription(datasetId: string): Promise<DatasetDescription> {
    const response = await this.client.GET("/api/datasets/{id}", {
      params: { path: { id: datasetId } },
    });

    if (response.error) {
      throw new Error("error/get/dataset");
    }

    if (!response.data) {
      throw new Error("no-data/get/dataset");
    }

    //TODO: Consult with backend about bad reutrns
    const result = response.data as unknown as Dataset;

    return { description: result.description } as DatasetDescription;
  }

  async listOwnedDatasets(ownerId: string): Promise<DatasetSummary[]> {
    const result = datasets as Dataset[];

    const filtered = result.filter((item) => item.ownerId === ownerId);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(filtered as DatasetSummary[]);
      }, 1000);
    });
  }

  async listQualityControllableDatasets(
    controllerId: string,
  ): Promise<DatasetSummary[]> {
    const result = datasets as Dataset[];

    console.log(controllerId);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(result as DatasetSummary[]);
      }, 1000);
    });
  }
}
