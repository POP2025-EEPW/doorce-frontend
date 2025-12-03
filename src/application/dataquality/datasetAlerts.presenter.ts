import type { QualityValidityAlert } from "@/domain/quality/quality.type.ts";

export default class DatasetAlertsPresenter {
  listDatasetAlerts(alerts: QualityValidityAlert[]): QualityValidityAlert[] {
    return alerts;
  }

  getErrorMessage(error: unknown): string {
    const message = this.extractMessage(error);
    switch (message) {
      case "error/list/datasetAlerts":
        return "Failed to load dataset alerts.";
      case "no-data/list/datasetAlerts":
        return "There are no alerts for this dataset.";
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
