import { uc } from "@/app/di";
import type {
  CreateDatasetInput,
  UpdateDatasetInput,
} from "@/domain/types/dataset";

export async function addDataset(input: CreateDatasetInput) {
  return uc.dataset.addDataset(input);
}

export async function loadDataset(datasetId: string) {
  return uc.dataset.getDataset(datasetId);
}

export async function updateDataset({
  id,
  input,
}: {
  id: string;
  input: UpdateDatasetInput;
}) {
  return uc.dataset.updateDataset(id, input);
}
