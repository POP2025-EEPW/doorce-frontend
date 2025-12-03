// entry.uc.ts

import { createApiClient } from "@/api/client";
import type { DatasetEntry } from "./dataset.types.ts";
import entries from "@/mocks/entries-mock.json";

const mockEntries = entries as DatasetEntry[];

export default class EntryUseCase {
  constructor(private readonly client: ReturnType<typeof createApiClient>) {}

  async listEntries(datasetId: string): Promise<DatasetEntry[]> {
    const filtered = mockEntries.filter(
      (entry) => entry.dataset_id === datasetId,
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(filtered);
      }, 500);
    });
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

    // Add to mock data for frontend display
    mockEntries.push({
      id: crypto.randomUUID(),
      dataset_id: datasetId,
      content,
      erroneous: false,
      suspicious: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  async setErroneous(entryId: string): Promise<void> {
    const response = await this.client.POST(
      "/api/quality/entries/{entryId}/mark-erroneous",
      {
        params: {
          path: { entryId },
        },
      },
    );

    if (response.error) {
      throw new Error("error/set/erroneous");
    }

    // Update mock data
    const entry = mockEntries.find((e) => e.id === entryId);
    if (entry) {
      entry.erroneous = true;
    }
  }

  async setSuspicious(entryId: string): Promise<void> {
    const response = await this.client.POST(
      "/api/quality/entries/{entryId}/mark-suspicious",
      {
        params: {
          path: { entryId },
        },
      },
    );

    if (response.error) {
      throw new Error("error/set/suspicious");
    }

    // Update mock data
    const entry = mockEntries.find((e) => e.id === entryId);
    if (entry) {
      entry.suspicious = true;
    }
  }
}
