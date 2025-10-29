import type {
  CreateDataRelatedRequestInput,
  CreateDatasetCommentInput,
  DataRelatedRequest,
  DatasetComment,
} from "@/domain/types/quality";

export interface QualityClient {
  addDatasetComment(
    datasetId: string,
    input: CreateDatasetCommentInput,
  ): Promise<{ id: string }>;
  listDatasetComments(datasetId: string): Promise<DatasetComment[]>;
  submitDataRelatedRequest(
    req: CreateDataRelatedRequestInput,
  ): Promise<{ id: string }>;
  listDataRelatedRequests(
    filter?: Partial<Pick<DataRelatedRequest, "status" | "createdBy">>,
  ): Promise<DataRelatedRequest[]>;
}

export function buildQualityUC(client: QualityClient) {
  return {
    addDatasetComment: (
      ...args: Parameters<QualityClient["addDatasetComment"]>
    ) => client.addDatasetComment(...args),
    listDatasetComments: (
      ...args: Parameters<QualityClient["listDatasetComments"]>
    ) => client.listDatasetComments(...args),
    submitDataRelatedRequest: (
      ...args: Parameters<QualityClient["submitDataRelatedRequest"]>
    ) => client.submitDataRelatedRequest(...args),
    listDataRelatedRequests: (
      ...args: Parameters<QualityClient["listDataRelatedRequests"]>
    ) => client.listDataRelatedRequests(...args),
  };
}
