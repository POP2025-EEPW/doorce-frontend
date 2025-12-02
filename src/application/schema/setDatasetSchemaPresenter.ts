// application/schema/setDatasetSchema.presenter.ts
import type { SetDatasetSchemaOutputPort } from "@/domain/schema/schema.type.ts";
import type { Dataset } from "@/domain/dataset/dataset.types";
import type { DataSchema } from "@/domain/schema/schema.type";

export interface SetDatasetSchemaNotification {
  type: "success" | "error";
  message: string;
}

export interface SetDatasetSchemaViewState {
  dataset: Dataset | null;
  schemas: DataSchema[];
  isModalOpen: boolean;
  notification: SetDatasetSchemaNotification | null;
}

type StateUpdater = (
  updater: (prev: SetDatasetSchemaViewState) => SetDatasetSchemaViewState,
) => void;

export default class SetDatasetSchemaPresenter
  implements SetDatasetSchemaOutputPort
{
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

  // --- Load Schemas ---
  presentSchemas(schemas: DataSchema[]): void {
    this.updateState((prev) => ({
      ...prev,
      schemas,
    }));
  }

  presentLoadSchemasError(error: unknown): void {
    this.updateState((prev) => ({
      ...prev,
      schemas: [],
      notification: { type: "error", message: this.getErrorMessage(error) },
    }));
  }

  // --- Set Schema ---
  presentSetSchemaSuccess(): void {
    this.updateState((prev) => ({
      ...prev,
      isModalOpen: false,
      notification: {
        type: "success",
        message: "Schema assigned successfully",
      },
    }));
  }

  presentSetSchemaError(error: unknown): void {
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
      case "error/load/schemas":
        return "Failed to load schemas.";
      case "error/set/schema":
        return "Failed to assign schema.";
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
