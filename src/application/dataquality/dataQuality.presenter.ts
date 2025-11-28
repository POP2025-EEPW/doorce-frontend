// application/dataquality/dataQuality.presenter.ts
import type { QualityOutputPort } from "@/domain/quality/quality.type.ts";
import type { DatasetComment } from "@/domain/quality/quality.type";

export interface QualityNotification {
  type: "success" | "error";
  message: string;
}

export interface QualityViewState {
  comments: DatasetComment[];
  notification: QualityNotification | null;
}

type StateUpdater = (
  updater: (prev: QualityViewState) => QualityViewState,
) => void;

export default class DataQualityPresenter implements QualityOutputPort {
  constructor(private readonly updateState: StateUpdater) {}

  // --- Set Quality Tag ---
  presentSetQualityTagSuccess(): void {
    this.updateState((prev) => ({
      ...prev,
      notification: { type: "success", message: "Quality tag updated" },
    }));
  }

  presentSetQualityTagError(error: unknown): void {
    this.updateState((prev) => ({
      ...prev,
      notification: { type: "error", message: this.getErrorMessage(error) },
    }));
    console.log("presenter");
  }

  // --- Add Comment ---
  presentAddCommentSuccess(): void {
    this.updateState((prev) => ({
      ...prev,
      notification: { type: "success", message: "Comment added" },
    }));
  }

  presentAddCommentError(error: unknown): void {
    this.updateState((prev) => ({
      ...prev,
      notification: { type: "error", message: this.getErrorMessage(error) },
    }));
  }

  // --- Load Comments ---
  presentComments(comments: DatasetComment[]): void {
    this.updateState((prev) => ({
      ...prev,
      comments,
    }));
  }

  presentLoadCommentsError(error: unknown): void {
    this.updateState((prev) => ({
      ...prev,
      notification: { type: "error", message: this.getErrorMessage(error) },
    }));
  }

  // --- Helpers ---
  private getErrorMessage(error: unknown): string {
    const message = this.extractMessage(error);
    switch (message) {
      case "error/load/dataset-comments":
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
