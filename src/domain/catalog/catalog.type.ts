import type { ID } from "../common.types";

export interface CatalogSummary {
  id: ID;
  title: string;
  description?: string;
  parentCatalogId: ID | null;
}

export interface Catalog extends CatalogSummary {
  // for tree UIs; backend may or may not return children
  children: CatalogSummary[];
}

export interface CreateCatalogDto {
  title: string;
  description: string;
  datasets: string[];
}
