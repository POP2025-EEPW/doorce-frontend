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
    console.log(id, dataset);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
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
    const result = datasets as Dataset[];

    const item = result.find((item) => item.id === datasetId);

    if (!item) {
      throw new Error("no-data/get/description");
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          description: item.description,
        });
      }, 1000);
    });
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
  const token = localStorage.getItem("authToken");
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
  const token = localStorage.getItem("authToken");
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text ?? `HTTP ${res.status}`);
  }
  return res.json();
}
