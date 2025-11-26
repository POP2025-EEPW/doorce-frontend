import type { DatasetComment } from "@/domain/quality/quality.type";

export default class DataQualityPresenter {
  listComments(comments: DatasetComment[]) {
    return comments;
  }

  getErrorMessage(error: unknown): string {
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
