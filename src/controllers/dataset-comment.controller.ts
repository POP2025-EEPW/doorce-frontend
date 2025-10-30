import { uc } from "@/app/di";
import type { CreateDatasetCommentInput } from "@/domain/types/quality";

export async function submitDatasetComment(
  datasetId: string,
  text: string,
): Promise<{ id: string }> {
  const input: CreateDatasetCommentInput = { text };
  return uc.quality.addDatasetComment(datasetId, input);
}
