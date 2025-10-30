// src/api/realClient.ts
import type { CombinedClient } from "@/api/types";
import type {
  Catalog,
  CatalogSummary,
  CreateCatalogInput,
  CreateDatasetInput,
  DatasetFilter,
  Dataset,
  UpdateDatasetInput,
} from "@/domain/types/dataset";
import type {
  CreateDataRelatedRequestInput,
  CreateDatasetCommentInput,
} from "@/domain/types/quality";
import { Http } from "./http";

export function buildRealClient(http: Http): CombinedClient {
  return {
    // dataset
    listCatalogs: (parentId?: string | null) => {
      const q = parentId !== undefined ? `?parentId=${parentId ?? ""}` : "";
      return http.get<CatalogSummary[]>(`/catalogs${q}`);
    },
    getCatalog: (id: string) => http.get<Catalog>(`/catalogs/${id}`),
    addCatalog: (input: CreateCatalogInput) =>
      http.post<{ id: string }>(`/catalogs`, input),
    listCatalogDatasets: (id: string, p = 1, s = 20) =>
      http.get(`/catalogs/${id}/datasets?page=${p}&pageSize=${s}`),
    addDataset: (input: CreateDatasetInput) =>
      http.post<{ id: string }>("/datasets", input),
    getDataset: (id: string) => http.get(`/datasets/${id}`),
    updateDataset: (id: string, input: UpdateDatasetInput) =>
      http.put<Dataset>(`/datasets/${id}`, input),
    setDataSchemaForDataset: (datasetId, schemaId) =>
      http.put<{ id: string }>(`/datasets/${datasetId}/dataSchema`, {
        schemaId,
      }),
    listDataSchemas: () => http.get(`/data-schemas`),

    listDatasets: (filter: DatasetFilter, p = 1, s = 20) =>
      http.post(`/datasets?page=${p}&pageSize=${s}`, filter),
    getDatasetDescription: (datasetId: string) =>
      http.get(`/datasets/${datasetId}/description`),
    listOwnedDatasets: (ownerId: string) =>
      http.get(`/datasets?userId=${ownerId}`),
    listQualityControllableDatasets: (controllerId: string) =>
      http.get(`/datasets/qualityControllable?controllerId=${controllerId}`),

    // quality
    addDatasetComment: (datasetId: string, input: CreateDatasetCommentInput) =>
      http.post(`/datasets/${datasetId}/comments`, input),
    listDatasetComments: (datasetId: string) =>
      http.get(`/datasets/${datasetId}/comments`),
    submitDataRelatedRequest: (req: CreateDataRelatedRequestInput) =>
      http.post(`/requests`, req),
    listDataRelatedRequests: () => http.get(`/requests`),

    // auth
    login: (credentials: { username: string; password: string }) =>
      http.post(`/login`, credentials),
    getMe: () => http.get(`/me`),
  };
}
