import { createApiClient } from "@/api/client";
import type { DatasetEntry } from "./dataset.types.ts";

export default class EntryUseCase {
  constructor(private readonly client: ReturnType<typeof createApiClient>) {}

  async listEntries(datasetId: string): Promise<DatasetEntry[]> {
    const response = await this.client.GET(
      "/api/datasets/{datasetId}/entries",
      {
        params: {
          path: { datasetId },
        },
      },
    );

    if (response.error) {
      throw new Error("error/list/entries");
    }

    return response.data as unknown as DatasetEntry[];
  }

  async addEntry(datasetId: string, content: string): Promise<void> {
    const response = await this.client.POST(
      "/api/datasets/{datasetId}/entries",
      {
        params: {
          path: { datasetId },
        },
        body: { content: content as unknown as Record<string, never> },
      },
    );

    if (response.error) {
      throw new Error("error/add/entry");
    }
  }

  async setErroneous(entryId: string): Promise<void> {
    const response = await this.client.POST(
      "/api/quality/entries/{entryId}/mark-erroneous",
      {
        params: {
          path: { entryId },
        },
        parseAs: "text",
      },
    );

    if (response.error) {
      throw new Error("error/set/erroneous");
    }
  }

  async setSuspicious(entryId: string): Promise<void> {
    const response = await this.client.POST(
      "/api/quality/entries/{entryId}/mark-suspicious",
      {
        params: {
          path: { entryId },
        },
        parseAs: "text",
      },
    );

    if (response.error) {
      throw new Error("error/set/suspicious");
    }
  }
}
