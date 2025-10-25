// src/api/realClient.ts
import type { CombinedClient } from "@/api/types";
import type {
  Catalog,
  CatalogSummary,
  CreateCatalogInput,
  CreateDatasetInput,
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
