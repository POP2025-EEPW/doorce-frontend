import type {
  Catalog,
  CatalogSummary,
  CreateCatalogInput,
  CreateDatasetInput,
  Dataset,
  DatasetSummary,
  DatasetFilter,
  DatasetDescription,
} from "@/domain/types/dataset";

export interface DatasetClient {
  listCatalogs(parentId?: string | null): Promise<CatalogSummary[]>;
  getCatalog(id: string): Promise<Catalog>;
  addCatalog(input: CreateCatalogInput): Promise<{ id: string }>;
  listCatalogDatasets(
    catalogId: string,
    page?: number,
    pageSize?: number,
  ): Promise<DatasetSummary[]>;
  addDataset(input: CreateDatasetInput): Promise<{ id: string }>;
  getDataset(id: string): Promise<Dataset>;
  listDatasets(
    filter?: DatasetFilter,
    page?: number,
    pageSize?: number,
  ): Promise<Dataset[]>;
  getDatasetDescription(datasetId: string): Promise<DatasetDescription>;
}

export function buildDatasetUC(client: DatasetClient) {
  return {
    listCatalogs: (parentId?: string | null) => client.listCatalogs(parentId),
    getCatalog: (id: string) => client.getCatalog(id),
    addCatalog: (input: CreateCatalogInput) => client.addCatalog(input),
    listCatalogDatasets: (id: string, p?: number, s?: number) =>
      client.listCatalogDatasets(id, p, s),
    addDataset: (input: CreateDatasetInput) => client.addDataset(input),
    getDataset: (id: string) => client.getDataset(id),
    listDatasets: (filter?: DatasetFilter, p?: number, s?: number) =>
      client.listDatasets(filter, p, s),
    getDatasetDescription: (datasetId: string) =>
      client.getDatasetDescription(datasetId),
  };
}
