import type {
  Dataset,
  DatasetSummary,
  DatasetDescription,
} from "@/domain/dataset/dataset.types";

export default class DatasetPresenter {
  listDatasets(datasets: DatasetSummary[]): DatasetSummary[] {
    return datasets;
  }

  getDataset(dataset: Dataset): Dataset {
    return dataset;
  }

  getDatasetDescription(description: DatasetDescription): DatasetDescription {
    return description;
  }

  getErrorMessage(error: unknown): string {
    const message = this.extractMessage(error);
    switch (message) {
      case "error/get/dataset":
        return "Failed to load dataset.";
      case "no-data/get/dataset":
        return "Dataset not found.";
      case "error/add/dataset":
        return "Failed to create dataset.";
      case "error/edit/dataset":
        return "Failed to update dataset.";
      case "no-data/get/description":
        return "Dataset description not found.";
      case "error/get/description":
        return "Failed to load dataset description.";
      case "error/load/comments":
        return "Failed to load comments.";
      case "error/add/comment":
        return "Failed to add comment.";
      case "error/set/quality-tag":
        return "Failed to set quality tag.";
      case "error/mark/entry-erroneous":
        return "Failed to mark entry as erroneous.";
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
