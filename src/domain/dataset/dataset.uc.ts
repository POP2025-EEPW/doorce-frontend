import { createApiClient } from "@/api/client";
import type {
  CreateDatasetDto,
  Dataset,
  DatasetDescription,
  DatasetFilter,
  DatasetSummary,
  UpdateDatasetDto,
} from "./dataset.types";
import type { ID } from "@/domain/common.types.ts";

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

  async downloadDataset(datasetId: ID): Promise<string> {
    const response = await this.client.GET(
      "/api/quality/datasets/{datasetId}/raw-download-link",
      {
        params: { path: { datasetId } },
        parseAs: "text",
      },
    );

    if (response.error) {
      throw new Error("error/download/dataset");
    }

    if (!response.data) {
      throw new Error("no-data/download/dataset");
    }

    return response.data as unknown as string;
  }

  async uploadRawDataset(datasetId: ID, url: string): Promise<void> {
    const response = await this.client.POST("/api/datasets/{datasetId}/raw", {
      params: {
        path: {
          datasetId,
        },
      },
      body: {
        dataUrl: url,
      },
    });

    if (response.error) {
      throw new Error("error/upload/raw-dataset");
    }
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
    page = 0,
    pageSize = 20,
  ): Promise<DatasetSummary[]> {
    const response = await this.client.GET("/api/datasets", {
      params: {
        query: {
          title: filter?.text,
          page,
          pageSize,
        },
      },
    });

    if (response.error) {
      throw new Error("error/list/datasets");
    }

    if (!response.data) {
      throw new Error("error/list/datasets");
    }

    const result = response.data as unknown as DatasetSummary[];

    return result;

    /*const filtered = result.filter((item) => {
      const matchesCatalog = filter?.catalogId
        ? item.catalogId === filter.catalogId
        : true;
      const matchesStatus = filter?.status
        ? item.status === filter.status
        : true;
      return matchesCatalog && matchesStatus;
    });

    const startIndex = (page - 1) * pageSize;
    const pagedResults = filtered.slice(startIndex, startIndex + pageSize);*/
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

  async listOwnedDatasets(userId: ID): Promise<DatasetSummary[]> {
    const response = await this.client.GET("/api/datasets/ownedby", {
      params: {
        query: {
          userId,
        },
      },
    });

    if (response.error) {
      throw new Error("error/list/owned-datasets");
    }

    if (!response.data) {
      throw new Error("error/list/owned-datasets");
    }

    const result = response.data as unknown as DatasetSummary[];

    return result;
    //const filtered = result.filter((item) => item.ownerId === ownerId);
  }

  async listQualityControllableDatasets(): Promise<DatasetSummary[]> {
    const response = await this.client.GET("/api/datasets/qualityControllable");

    if (response.error) {
      throw new Error("error/list/quality-controllable-datasets");
    }

    if (!response.data) {
      throw new Error("error/list/quality-controllable-datasets");
    }

    const result = response.data as unknown as DatasetSummary[];

    return result;
  }
}
export interface DataRelatedRequestPayload {
  subject: string;
  description: string;
}

export async function submitDataRelatedRequest(
  datasetId: string,
  payload: DataRelatedRequestPayload,
) {
  const url = `/api/datasets/${encodeURIComponent(datasetId)}/requests`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function listDataRelatedRequests(
  datasetId: string,
  page = 0,
  pageSize = 20,
) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  const url = `/api/datasets/${encodeURIComponent(datasetId)}/requests?${params.toString()}`;
  const headers: Record<string, string> = {};
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text ?? `HTTP ${res.status}`);
  }
  return res.json();
}
