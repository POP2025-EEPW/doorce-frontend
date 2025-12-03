import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "@/api/client.ts";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import QualityUseCase from "@/domain/quality/quality.uc.ts";
import DatasetAlertsPresenter from "@/application/dataquality/datasetAlerts.presenter.ts";

export function useDatasetAlertsController(datasetId: string) {
  const [unresolvedOnly, setUnresolvedOnly] = useState<boolean>(false);

  const deps = useRef<{
    qualityUseCase: QualityUseCase;
    presenter: DatasetAlertsPresenter;
  } | null>(null);

  deps.current ??= {
    qualityUseCase: new QualityUseCase(apiClient),
    presenter: new DatasetAlertsPresenter(),
  };

  const { qualityUseCase, presenter } = deps.current;

  // List dataset alerts query
  const {
    data: alerts = [],
    isLoading: isDatasetAlertsLoading,
    error: datasetAlertsError,
  } = useQuery({
    queryKey: ["listDatasetAlerts", datasetId, unresolvedOnly],
    queryFn: () => qualityUseCase.listDatasetAlerts(datasetId, unresolvedOnly),
    select: (data) => presenter.listDatasetAlerts(data),
  });

  useEffect(() => {
    if (datasetAlertsError) {
      toast.error(presenter.getErrorMessage(datasetAlertsError));
    }
  }, [datasetAlertsError, presenter]);

  const onUnresolvedOnlyChange = useCallback((newValue: boolean) => {
    setUnresolvedOnly(newValue);
  }, []);

  return {
    // Data - directly from React Query
    alerts,
    unresolvedOnly,

    // Loading states
    isDatasetAlertsLoading,

    // Actions
    onUnresolvedOnlyChange,
  };
}
