import type { 
  DataSchema, 
  SchemaOutputPort 
} from "@/domain/schema/schema.type";

export interface SchemaNotification {
  type: "success" | "error";
  message: string;
}

export interface SchemaViewState {
  isModalOpen: boolean;
  notification: SchemaNotification | null;
  schemas: DataSchema[];
  selectedSchema: DataSchema | null;
}

type StateUpdater = (updater: (prev: SchemaViewState) => SchemaViewState) => void;

export default class SchemaPresenter implements SchemaOutputPort {
  constructor(private readonly updateState: StateUpdater) {}

  clearNotification(): void {
    this.updateState((prev) => ({
      ...prev,
      notification: null,
    }));
  }

  presentSchemas(schemas: DataSchema[]): void {
    this.updateState((prev) => ({
      ...prev,
      schemas,
      notification: null,
    }));
  }

  presentListSchemasError(error: unknown): void {
    console.error("SchemaPresenter list error:", error);
    this.updateState((prev) => ({
      ...prev,
      schemas: [],
      notification: null,
    }));
  }

  presentAddSchemaSuccess(): void {
    this.updateState((prev) => ({
      ...prev,
      isModalOpen: false,
      notification: {
        type: "success",
        message: "Data schema added successfully.",
      },
    }));
  }

  presentAddSchemaError(error: unknown): void {
    this.updateState((prev) => ({
      ...prev,
      notification: {
        type: "error",
        message: this.getErrorMessage(error),
      },
    }));
  }

  presentSchemaDetails(schema: DataSchema): void {
    this.updateState((prev) => ({
      ...prev,
      selectedSchema: schema,
    }));
  }

  presentGetSchemaError(error: unknown): void {
    this.updateState((prev) => ({
      ...prev,
      notification: {
        type: "error",
        message: "Failed to load schema details.",
      },
    }));
  }

  presentEditSchemaSuccess(): void {
    this.updateState((prev) => ({
      ...prev,
      isModalOpen: false,
      selectedSchema: null,
      notification: {
        type: "success",
        message: "Data schema updated successfully.",
      },
    }));
  }

  presentEditSchemaError(error: unknown): void {
    this.updateState((prev) => ({
      ...prev,
      notification: {
        type: "error",
        message: this.getErrorMessage(error),
      },
    }));
  }

  presentSetDatasetSchemaSuccess(): void {
     this.updateState((prev) => ({
      ...prev,
      notification: { type: "success", message: "Schema assigned to dataset." }
     }));
  }

  presentSetDatasetSchemaError(error: unknown): void {
     this.updateState((prev) => ({
      ...prev,
      notification: { 
        type: "error", 
        message: this.getErrorMessage(error) 
      }
     }));
  }

  showAddSchemaForm(): void {
    this.updateState((prev) => ({
      ...prev,
      isModalOpen: true,
      selectedSchema: null,
      notification: null,
    }));
  }

  showEditSchemaForm(schema: DataSchema): void {
    this.updateState((prev) => ({
      ...prev,
      isModalOpen: true,
      selectedSchema: schema,
      notification: null,
    }));
  }

  presentCloseModal(): void {
    this.updateState((prev) => ({
      ...prev,
      isModalOpen: false,
      selectedSchema: null,
      notification: null,
    }));
  }

  private getErrorMessage(error: unknown): string {
    const message = this.extractMessage(error);
    switch (message) {
      case "error/list/schemas":
        return "Failed to load data schemas.";
      case "error/add/schema":
        return "Failed to create new schema.";
      case "validation/schema/no-concepts":
        return "Schema must have at least one concept.";
      case "error/edit/schema":
        return "Failed to update schema.";
      case "error/get/schema":
        return "Failed to load schema details.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  private extractMessage(error: unknown): string | undefined {
    if (!error) return undefined;
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return undefined;
  }
}