// entry.presenter.ts

import type { DatasetEntry } from "@/domain/dataset/dataset.types";

export default class EntryPresenter {
  listEntries(entries: DatasetEntry[]): DatasetEntry[] {
    return entries;
  }

  getErrorMessage(error: unknown): string {
    const message = this.extractMessage(error);
    switch (message) {
      case "error/list/entries":
        return "Failed to load entries.";
      case "no-data/list/entries":
        return "No entries found.";
      case "error/add/entry":
        return "Failed to add entry.";
      case "error/set/erroneous":
        return "Failed to update erroneous status.";
      case "error/set/suspicious":
        return "Failed to update suspicious status.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  private extractMessage(error: unknown): string | undefined {
    if (!error) return undefined;
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    if (
      typeof error === "object" &&
      "message" in (error as Record<string, unknown>)
    ) {
      const msg = (error as Record<string, unknown>).message;
      if (typeof msg === "string") return msg;
    }
    return undefined;
  }
}
