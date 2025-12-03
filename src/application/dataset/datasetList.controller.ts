import type {
  DatasetFilter,
  DatasetSummary,
} from "@/domain/dataset/dataset.types.ts";
import { useCallback, useEffect, useRef, useState } from "react";
import DatasetUseCase from "@/domain/dataset/dataset.uc.ts";
import { apiClient } from "@/api/client.ts";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/application/auth/auth-store.ts";
import { toast } from "sonner";
import DatasetListPresenter from "@/application/dataset/datasetList.presenter.ts";
import { useNavigate } from "react-router-dom";

export function useDatasetListController(filter?: DatasetFilter) {
  const [filters, setFilters] = useState<DatasetFilter>(filter ?? {});

  const deps = useRef<{
    datasetUseCase: DatasetUseCase;
    presenter: DatasetListPresenter;
  } | null>(null);

  deps.current ??= {
    datasetUseCase: new DatasetUseCase(apiClient),
    presenter: new DatasetListPresenter(),
  };

  const { datasetUseCase, presenter } = deps.current;
  const auth = useAuth();
  const navigate = useNavigate();

  // List datasets query
  const {
    data: datasets = [],
    isLoading: isDatasetsLoading,
    error: datasetListError,
  } = useQuery({
    queryKey: ["listDatasets", filter],
    queryFn: () => {
      const isDataQualityManger = auth.roles.includes("DataQualityManager");
      const isDataSupplier = auth.roles.includes("DataSupplier");

      if (isDataQualityManger && !isDataSupplier)
        return datasetUseCase.listQualityControllableDatasets();

      if (isDataSupplier && !isDataQualityManger)
        return datasetUseCase.listOwnedDatasets();

      return datasetUseCase.listDatasets(filter);
    },
    select: (data) => presenter.listDatasets(data),
  });

  useEffect(() => {
    if (datasetListError) {
      toast.error(presenter.getErrorMessage(datasetListError));
    }
  }, [datasetListError, presenter]);

  const onFilterChange = useCallback(
    (filter: keyof DatasetFilter, newValue: string) => {
      setFilters((prev) => ({ ...prev, [filter]: newValue }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const onDatasetSelected = useCallback(
    (datasetId: DatasetSummary["id"]) => {
      const isDataQualityManger = auth.roles.includes("DataQualityManager");
      const isDataSupplier = auth.roles.includes("DataSupplier");

      if (isDataQualityManger && !isDataSupplier)
        navigate(`/dataset/${datasetId}/entries`);

      navigate(`/dataset/${datasetId}`);
    },
    [auth, navigate],
  );

  return {
    // Data - directly from React Query
    datasets,
    filters,

    // Loading states
    isDatasetsLoading,

    // Actions
    onFilterChange,
    resetFilters,
    onDatasetSelected,
  };
}
