import { createApiClient } from "@/api/client";
import type { CreateDatasetCommentDto, DatasetComment } from "./quality.type";

export default class QualityUseCase {
  constructor(private readonly client: ReturnType<typeof createApiClient>) {}

  async addDatasetComment(
    datasetId: string,
    comment: CreateDatasetCommentDto,
  ): Promise<string> {
    console.log(datasetId, comment);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("UNNECESARY DATA");
      }, 1000);
    });
  }

  async loadDatasetComments(datasetId: string): Promise<DatasetComment[]> {
    const module = await import("@/mocks/comments.json");
    const mockComments = module.default as unknown as DatasetComment[];

    const filtered = mockComments.filter((c) => c.datasetId === datasetId);

    return new Promise((resolve) => {
      setTimeout(() => resolve(filtered), 800);
    });
  }
}
