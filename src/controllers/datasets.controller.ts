import { uc } from "@/app/di";
import type { CreateDatasetInput, DatasetFilter } from "@/domain/types/dataset";

export async function addDataset(input: CreateDatasetInput) {
  return uc.dataset.addDataset(input);
}

export async function loadDataset(datasetId: string) {
  return uc.dataset.getDataset(datasetId);
}

export async function loadDatasets(
  filter?: DatasetFilter,
  page?: number,
  pageSize?: number,
) {
  return uc.dataset.listDatasets(filter, page, pageSize);
}
