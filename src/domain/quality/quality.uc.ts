import { createApiClient } from "@/api/client";
import type {
  CreateDatasetCommentDto,
  DatasetComment,
  SetQualityTagDto,
} from "./quality.type";

export default class QualityUseCase {
  constructor(private readonly client: ReturnType<typeof createApiClient>) {}

  async addDatasetComment(
    datasetId: string,
    comment: CreateDatasetCommentDto,
  ): Promise<void> {
    const response = await this.client.POST(
      "/api/datasets/{datasetId}/comments",
      {
        params: {
          path: {
            datasetId: datasetId,
          },
        },
        body: comment,
      },
    );

    if (response.error) {
      throw new Error("error/add/dataset");
    }
  }

  async setQualityTag(
    datasetId: string,
    qualityTag: SetQualityTagDto,
  ): Promise<void> {
    const response = await this.client.PUT(
      "/api/quality/datasets/{datasetId}/quality-tag",
      {
        params: {
          path: {
            datasetId: datasetId,
          },
        },
        body: qualityTag,
      },
    );

    if (response.error) {
      throw new Error("error/set/quality-tag");
    }
  }

  async markDataEntryErroneous(entryId: string): Promise<void> {
    const response = await this.client.POST(
      "/api/quality/entries/{entryId}/mark-erroneous",
      {
        params: {
          path: {
            entryId: entryId,
          },
        },
      },
    );

    if (response.error) {
      throw new Error("error/mark/entry-erroneous");
    }
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
