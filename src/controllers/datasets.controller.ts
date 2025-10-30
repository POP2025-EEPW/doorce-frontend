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

export async function getDatasetDescription(datasetId: string) {
  return uc.dataset.getDatasetDescription(datasetId);
}

export async function loadOwnedDatasets(ownerId: string) {
  return uc.dataset.listOwnedDatasets(ownerId);
}

export async function loadQualityControllableDatasets(controllerId: string) {
  return uc.dataset.listQualityControllableDatasets(controllerId);
}
