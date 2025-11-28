// application/dataset/editDataset.presenter.ts
import type {
  EditDatasetOutputPort,
  Dataset,
} from "@/domain/dataset/dataset.types";

export interface EditDatasetNotification {
  type: "success" | "error";
  message: string;
}

export interface EditDatasetViewState {
  dataset: Dataset | null;
  isModalOpen: boolean;
  notification: EditDatasetNotification | null;
}

type StateUpdater = (
  updater: (prev: EditDatasetViewState) => EditDatasetViewState,
) => void;

export default class EditDatasetPresenter implements EditDatasetOutputPort {
  constructor(private readonly updateState: StateUpdater) {}

  // --- Load Dataset ---
  presentDataset(dataset: Dataset): void {
    this.updateState((prev) => ({
      ...prev,
      dataset,
    }));
  }

  presentLoadDatasetError(error: unknown): void {
    this.updateState((prev) => ({
      ...prev,
      dataset: null,
      notification: { type: "error", message: this.getErrorMessage(error) },
    }));
  }

  // --- Edit Dataset ---
  presentEditDatasetSuccess(): void {
    this.updateState((prev) => ({
      ...prev,
      isModalOpen: false,
      notification: {
        type: "success",
        message: "Dataset updated successfully",
      },
    }));
  }

  presentEditDatasetError(error: unknown): void {
    this.updateState((prev) => ({
      ...prev,
      notification: { type: "error", message: this.getErrorMessage(error) },
    }));
  }

  // --- Helpers ---
  private getErrorMessage(error: unknown): string {
    const message = this.extractMessage(error);
    switch (message) {
      case "error/get/dataset":
        return "Failed to load dataset.";
      case "no-data/get/dataset":
        return "Dataset not found.";
      case "error/edit/dataset":
        return "Failed to update dataset.";
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
