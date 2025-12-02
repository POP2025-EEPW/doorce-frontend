import {
  submitDataRelatedRequest as apiSubmit,
  listDataRelatedRequests as apiList,
} from "../../domain/dataset/dataset.uc";
import type { DataRelatedRequestPayload } from "../../domain/dataset/dataset.uc";

export async function submitDataRelatedRequest(
  datasetId: string,
  payload: DataRelatedRequestPayload,
) {
  const result = await apiSubmit(datasetId, payload);
  return result;
}

export async function listDataRelatedRequest(
  datasetId: string,
  page = 0,
  pageSize = 20,
) {
  const items = await apiList(datasetId, page, pageSize);
  return items;
}
