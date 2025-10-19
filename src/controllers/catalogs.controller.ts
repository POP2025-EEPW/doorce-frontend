import { uc } from "@/app/di";
import type { CreateCatalogInput } from "@/domain/types/dataset";

export async function loadCatalogs(parentId?: string | null) {
  return uc.dataset.listCatalogs(parentId);
}

export async function loadCatalog(catalogId: string) {
  return uc.dataset.getCatalog(catalogId);
}

export async function loadCatalogDatasets(
  catalogId: string,
  page?: number,
  pageSize?: number
) {
  return uc.dataset.listCatalogDatasets(catalogId, page, pageSize);
}

export async function addCatalog(input: CreateCatalogInput) {
  return uc.dataset.addCatalog(input);
}
