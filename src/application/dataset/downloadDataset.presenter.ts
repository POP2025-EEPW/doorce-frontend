export default class DownloadDatasetPresenter {
  downloadDataset(downloadLink: string): string {
    return downloadLink;
  }

  getErrorMessage(error: unknown): string {
    const message = this.extractMessage(error);
    switch (message) {
      case "error/download/dataset":
        return "Failed to download dataset.";
      case "no-data/download/dataset":
        return "There is no download url for this dataset.";
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
