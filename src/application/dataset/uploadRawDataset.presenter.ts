export default class UploadRawDatasetPresenter {
  uploadRawDataset(url: string): string {
    return url;
  }

  getErrorMessage(error: unknown): string {
    const message = this.extractMessage(error);
    switch (message) {
      case "error/upload/raw-dataset":
        return "Failed to upload raw dataset.";
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
