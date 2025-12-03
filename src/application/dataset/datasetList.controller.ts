import type {
  DatasetFilter,
  DatasetSummary,
  DatasetTab,
} from "@/domain/dataset/dataset.types.ts";
import { useCallback, useEffect, useRef, useState } from "react";
import DatasetUseCase from "@/domain/dataset/dataset.uc.ts";
import { apiClient } from "@/api/client.ts";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/application/auth/auth-store.ts";
import { toast } from "sonner";
import DatasetListPresenter from "@/application/dataset/datasetList.presenter.ts";
import { useNavigate } from "react-router-dom";

type DataListPermissions = {
  canDisplayAlerts: boolean;
  canDownload: boolean;
  canAddRawLink: boolean;
};

const initialPermissions = {
  canDisplayAlerts: false,
  canDownload: false,
  canAddRawLink: false,
};

export function useDatasetListController(filter?: DatasetFilter) {
  const [filters, setFilters] = useState<DatasetFilter>(filter ?? {});
  const [tabs, setTabs] = useState<DatasetTab[]>([]);
  const [activeTab, setActiveTab] = useState<DatasetTab | undefined>(undefined);
  const [permissions, setPermissions] =
    useState<DataListPermissions>(initialPermissions);

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

  useEffect(() => {
    const localTabs: DatasetTab[] = [];

    if (auth.roles.includes("DataQualityManager"))
      localTabs.push("qualityControllable");
    if (auth.roles.includes("DataSupplier")) localTabs.push("owned");
    if (auth.roles.includes("Admin")) localTabs.push("all");

    setActiveTab(localTabs[0]);
    setTabs(localTabs);
  }, [auth]);

  // List datasets query
  const {
    data: datasets = [],
    isLoading: isDatasetsLoading,
    error: datasetListError,
  } = useQuery({
    queryKey: ["listDatasets", filter, activeTab, auth],
    queryFn: () => {
      switch (activeTab) {
        case "qualityControllable":
          return datasetUseCase.listQualityControllableDatasets();

        case "owned":
          return datasetUseCase.listOwnedDatasets(auth.userId ?? "");

        case "all":
          return datasetUseCase.listDatasets(filter);

        default:
          return [];
      }
    },
    select: (data) => presenter.listDatasets(data),
  });

  useEffect(() => {
    if (datasetListError) {
      toast.error(presenter.getErrorMessage(datasetListError));
    }
  }, [datasetListError, presenter]);

  useEffect(() => {
    const isDataQualityManger = auth.roles.includes("DataQualityManager");
    const isDataSupplier = auth.roles.includes("DataSupplier");

    setPermissions((prev) => ({
      ...prev,
      canDisplayAlerts: isDataQualityManger || isDataSupplier,
    }));
  }, [auth]);

  useEffect(() => {
    setPermissions((prev) => ({
      ...prev,
      canDownload: auth.roles.includes("DataUser"),
    }));
  }, [auth]);

  useEffect(() => {
    const canAddRawLink =
      auth.roles.includes("DataSupplier") && activeTab === "owned";
    setPermissions((prev) => ({ ...prev, canAddRawLink }));
  }, [auth, activeTab]);

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
      if (activeTab == "qualityControllable") {
        navigate(`/dataset/${datasetId}/entries`);
        return;
      }

      navigate(`/dataset/${datasetId}`);
    },
    [activeTab, navigate],
  );

  const onShowAlerts = useCallback(
    (datasetId: DatasetSummary["id"]) => {
      const isDataQualityManger = auth.roles.includes("DataQualityManager");
      const isDataSupplier = auth.roles.includes("DataSupplier");

      if (isDataQualityManger || isDataSupplier)
        navigate(`/dataset/${datasetId}/alerts`);
    },
    [auth, navigate],
  );

  const onTabChange = useCallback((selectedTab: DatasetTab) => {
    setActiveTab(selectedTab);
  }, []);

  return {
    // Data - directly from React Query
    datasets,
    filters,
    tabs,
    activeTab,

    // Loading states
    isDatasetsLoading,

    // Actions
    onFilterChange,
    onTabChange,
    resetFilters,
    onDatasetSelected,
    onShowAlerts,
    permissions,
  };
}
