import type {
  CreateDataRelatedRequestInput,
  CreateDatasetCommentInput,
  DataRelatedRequest,
  DatasetComment,
} from "@/domain/types/quality";

export interface QualityClient {
  addDatasetComment(
    datasetId: string,
    input: CreateDatasetCommentInput
  ): Promise<{ id: string }>;
  listDatasetComments(datasetId: string): Promise<DatasetComment[]>;
  submitDataRelatedRequest(
    req: CreateDataRelatedRequestInput
  ): Promise<{ id: string }>;
  listDataRelatedRequests(
    filter?: Partial<Pick<DataRelatedRequest, "status" | "createdBy">>
  ): Promise<DataRelatedRequest[]>;
}

export function buildQualityUC(client: QualityClient) {
  return {
    addDatasetComment: client.addDatasetComment,
    listDatasetComments: client.listDatasetComments,
    submitDataRelatedRequest: client.submitDataRelatedRequest,
    listDataRelatedRequests: client.listDataRelatedRequests,
  };
}
