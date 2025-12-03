import type { DatasetSummary } from "@/domain/dataset/dataset.types.ts";

export default class DatasetListPresenter {
  listDatasets(datasets: DatasetSummary[]): DatasetSummary[] {
    return datasets;
  }

  getErrorMessage(error: unknown): string {
    const message = this.extractMessage(error);
    switch (message) {
      case "error/list/datasets":
        return "Failed to load datasets.";
      case "error/list/owned-datasets":
        return "Failed to load owned datasets.";
      case "error/list/quality-controllable-datasets":
        return "Failed to load quality controllable datasets.";
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
