import { createApiClient } from "@/api/client";
import type { Catalog, CatalogSummary, CreateCatalogDto } from "./catalog.type";
import type { DatasetSummary } from "../dataset/dataset.types";

export default class CatalogUseCase {
  constructor(private readonly client: ReturnType<typeof createApiClient>) {}

  async addCatalog(vars: {
    parentCatalogId?: string;
    catalog: CreateCatalogDto;
  }): Promise<void> {
    const response = await this.client.POST("/api/catalogs", {
      body: {
        parentCatalogId: vars.parentCatalogId,
        catalog: {
          ...vars.catalog,
          datasets: [],
        },
      },
    });

    if (response.error) {
      throw new Error("error/add/catalog");
    }
  }

  async getCatalog(vars: { catalogId: string }): Promise<Catalog> {
    const response = await this.client.GET("/api/catalogs/{catalogId}", {
      params: {
        path: {
          catalogId: vars.catalogId,
        },
      },
    });

    if (response.error) {
      const status = (response as { response?: { status?: number } }).response
        ?.status;
      if (status === 404) {
        throw new Error("error/get/catalog/not-found");
      }
      throw new Error("error/get/catalog");
    }

    if (!response.data) {
      throw new Error("no-data/get/catalog");
    }

    const data = response.data as unknown as Catalog;

    return data;
  }

  async listCatalogs(
    parentCatalogId: string | null,
  ): Promise<CatalogSummary[]> {
    const response = await this.client.GET("/api/catalogs", {
      params: {
        query: {
          parentCatalogId: parentCatalogId ?? undefined,
        },
      },
    });

    if (response.error) {
      throw new Error("error/get/catalog/list");
    }

    if (!response.data) {
      throw new Error("no-data/get/catalog/list");
    }

    const data = response.data as unknown as CatalogSummary[];

    return data;
  }

  async listCatalogDatasets(vars: {
    catalogId: string;
  }): Promise<DatasetSummary[]> {
    const response = await this.client.GET(
      "/api/catalogs/{catalogId}/datasets",
      {
        params: {
          path: {
            catalogId: vars.catalogId,
          },
        },
      },
    );

    if (response.error) {
      const status = (response as { response?: { status?: number } }).response
        ?.status;
      if (status === 404) {
        throw new Error("error/get/catalog/dataset/list/not-found");
      }
      throw new Error("error/get/catalog/dataset/list");
    }

    if (!response.data) {
      return [];
    }

    const data = response.data as unknown as DatasetSummary[];

    return Array.isArray(data) ? data : [];
  }
}
