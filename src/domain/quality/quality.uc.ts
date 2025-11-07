// import { createApiClient } from "@/api/client";
import type { CreateDatasetCommentDto } from "./quality.type";

export default class QualityUseCase {
  //   constructor(private readonly client: ReturnType<typeof createApiClient>) {}

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
}
