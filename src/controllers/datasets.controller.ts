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

export async function setDataSchemaForDataset(
  datasetId: string,
  schemaId: string,
) {
  return uc.dataset.setDataSchemaFotDataset(datasetId, schemaId);
}

export async function loadDataSchemas() {
  return uc.dataset.listDataSchemas();
}
