// entry.uc.ts

import { createApiClient } from "@/api/client";
import type { DatasetEntry } from "./dataset.types.ts";
import entries from "@/mocks/entries-mock.json";

const mockEntries = entries as DatasetEntry[];

export default class EntryUseCase {
  constructor(private readonly client: ReturnType<typeof createApiClient>) {}

  async listEntries(datasetId: string): Promise<DatasetEntry[]> {
    const result = entries as DatasetEntry[];

    const filtered = result.filter((entry) => entry.dataset_id === datasetId);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(filtered);
      }, 500);
    });

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    console.log(this.client.toString());
    //   const response = await this.client.GET("/api/datasets/{id}/entries", {
    //     params: {
    //       path: { id: datasetId },
    //     },
    //   });
    //
    //   if (response.error) {
    //     throw new Error("error/list/entries");
    //   }
    //
    //   if (!response.data) {
    //     throw new Error("no-data/list/entries");
    //   }
    //
    //   return response.data as unknown as DatasetEntry[];
  }

  async setErroneous(
    datasetId: string,
    entryId: string,
    erroneous: boolean,
  ): Promise<void> {
    // Mock: update local data
    const entry = mockEntries.find(
      (e) => e.id === entryId && e.dataset_id === datasetId,
    );
    if (entry) {
      entry.erroneous = erroneous;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }

  async setSuspicious(
    datasetId: string,
    entryId: string,
    suspicious: boolean,
  ): Promise<void> {
    // Mock: update local data
    const entry = mockEntries.find(
      (e) => e.id === entryId && e.dataset_id === datasetId,
    );
    if (entry) {
      entry.suspicious = suspicious;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }
}
