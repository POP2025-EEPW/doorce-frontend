import type { Catalog, CatalogSummary } from "@/domain/catalog/catalog.type";
import type { DatasetSummary } from "@/domain/dataset/dataset.types";

export default class CatalogPresenter {
  listCatalogs(catalogs: CatalogSummary[]) {
    return catalogs;
  }

  getCatalog(catalog: Catalog) {
    return catalog;
  }

  listCatalogDatasets(datasets: DatasetSummary[]) {
    return datasets;
  }

  getErrorMessage(error: unknown): string {
    const message = this.extractMessage(error);
    switch (message) {
      case "error/get/catalog/not-found":
        return "Catalog not found.";
      case "error/get/catalog/dataset/list/not-found":
        return "Catalog not found or has no datasets.";
      case "error/get/catalog/dataset/list":
        return "Failed to load datasets.";
      case "error/get/catalog":
        return "Failed to load catalog.";
      case "error/get/catalog/list":
        return "Failed to load catalogs.";
      case "error/add/catalog":
        return "Failed to create catalog.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  private extractMessage(error: unknown): string | undefined {
    if (!error) return undefined;
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    if (
      typeof error === "object" &&
      "message" in (error as Record<string, unknown>)
    ) {
      const msg = (error as Record<string, unknown>).message;
      if (typeof msg === "string") return msg;
    }
    return undefined;
  }
}
