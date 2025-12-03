// domain/quality/quality.uc.ts
import { createApiClient } from "@/api/client";
import type {
  CreateDatasetCommentDto,
  DatasetComment,
  SetQualityTagDto,
} from "./quality.type";
import type { QualityOutputPort } from "./quality.type.ts";

export default class QualityUseCase {
  constructor(
    private readonly client: ReturnType<typeof createApiClient>,
    private readonly outputPort: QualityOutputPort,
  ) {}

  async setQualityTag(
    datasetId: string,
    qualityTag: SetQualityTagDto,
  ): Promise<void> {
    try {
      const response = await this.client.PUT(
        "/api/quality/datasets/{datasetId}/quality-tag",
        {
          params: {
            path: { datasetId },
          },
          body: qualityTag,
          parseAs: "text",
        },
      );
      if (!response.response.ok) {
        throw new Error("error/set/quality-tag");
      }

      this.outputPort.presentSetQualityTagSuccess();
    } catch (error) {
      console.log("usecase");
      this.outputPort.presentSetQualityTagError(error);
      throw error;
    }
  }

  async addDatasetComment(
    datasetId: string,
    comment: CreateDatasetCommentDto,
  ): Promise<void> {
    try {
      const response = await this.client.POST(
        "/api/datasets/{datasetId}/comments",
        {
          params: {
            path: { datasetId },
          },
          body: comment,
        },
      );

      if (response.error) {
        throw new Error("error/add/comment");
      }

      this.outputPort.presentAddCommentSuccess();
    } catch (error) {
      this.outputPort.presentAddCommentError(error);
      throw error;
    }
  }

  async loadDatasetComments(datasetId: string): Promise<DatasetComment[]> {
    try {
      const response = await this.client.GET(
        "/api/datasets/{datasetId}/comments",
        {
          params: {
            path: { datasetId },
          },
        },
      );

      if (response.error) {
        throw new Error("error/load/dataset-comments");
      }

      const comments = response.data as unknown as DatasetComment[];

      this.outputPort.presentComments(comments);

      return comments;
    } catch (error) {
      this.outputPort.presentLoadCommentsError(error);
      throw error;
    }
  }

  async markDataEntryErroneous(entryId: string): Promise<void> {
    // Similar pattern...
    const response = await this.client.POST(
      "/api/quality/entries/{entryId}/mark-erroneous",
      {
        params: {
          path: { entryId },
        },
      },
    );

    if (response.error) {
      throw new Error("error/mark/entry-erroneous");
    }
  }
}
