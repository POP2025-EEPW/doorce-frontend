import type {
  CreateDatasetDto,
  DatasetFilter,
  DatasetTab,
} from "@/domain/dataset/dataset.types.ts";
import { useCallback, useEffect, useRef, useState } from "react";
import DatasetUseCase from "@/domain/dataset/dataset.uc.ts";
import { apiClient } from "@/api/client.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/application/auth/auth-store.ts";
import { toast } from "sonner";
import DatasetListPresenter from "@/application/dataset/datasetList.presenter.ts";
import { useNavigate } from "react-router-dom";

type DataListPermissions = {
  canDisplayAlerts: boolean;
  canDownload: boolean;
  canAddRawLink: boolean;
  canCreateDataset: boolean;
};

const initialPermissions = {
  canDisplayAlerts: false,
  canDownload: false,
  canAddRawLink: false,
  canCreateDataset: false,
};

export function useDatasetListController(filter?: DatasetFilter) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const auth = useAuth();

  // --- State ---
  const [filters, setFilters] = useState<DatasetFilter>(filter ?? {});
  const [tabs, setTabs] = useState<DatasetTab[]>([]);
  const [activeTab, setActiveTab] = useState<DatasetTab | undefined>(undefined);
  const [permissions, setPermissions] =
    useState<DataListPermissions>(initialPermissions);

  // Stan zarządzania modalem dodawania bezpośrednio w kontrolerze
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- Refs / Deps ---
  const deps = useRef<{
    datasetUseCase: DatasetUseCase;
    presenter: DatasetListPresenter;
  } | null>(null);

  deps.current ??= {
    datasetUseCase: new DatasetUseCase(apiClient),
    presenter: new DatasetListPresenter(),
  };

  const { datasetUseCase, presenter } = deps.current;

  // --- Tabs Logic ---
  useEffect(() => {
    const localTabs: DatasetTab[] = [];
    if (auth.roles.includes("DataQualityManager"))
      localTabs.push("qualityControllable");
    if (auth.roles.includes("DataSupplier")) localTabs.push("owned");
    if (auth.roles.includes("Admin")) localTabs.push("all");

    setActiveTab(localTabs[0]);
    setTabs(localTabs);
  }, [auth]);

  // --- Queries ---
  const {
    data: datasets = [],
    isLoading: isDatasetsLoading,
    error: datasetListError,
  } = useQuery({
    queryKey: ["listDatasets", filters, activeTab, auth.userId], // używamy filters ze stanu
    queryFn: () => {
      switch (activeTab) {
        case "qualityControllable":
          return datasetUseCase.listQualityControllableDatasets();
        case "owned":
          return datasetUseCase.listOwnedDatasets(auth.userId ?? "");
        case "all":
          return datasetUseCase.listDatasets(filters);
        default:
          return [];
      }
    },
    select: (data) => presenter.listDatasets(data),
  });

  // --- Mutations ---
  const addDatasetMutation = useMutation({
    mutationFn: (newDataset: CreateDatasetDto) =>
      datasetUseCase.addDataset(newDataset),
    onSuccess: () => {
      toast.success("Dataset created successfully");
      queryClient.invalidateQueries({ queryKey: ["listDatasets"] });
      setIsAddModalOpen(false); // Zamykamy modal automatycznie po sukcesie
    },
    onError: (error: any) => {
      toast.error(presenter.getErrorMessage(error));
    },
  });

  // --- Permissions Logic ---
  useEffect(() => {
    const isDataQualityManager = auth.roles.includes("DataQualityManager");
    const isDataSupplier = auth.roles.includes("DataSupplier");
    const isDataUser = auth.roles.includes("DataUser");

    setPermissions({
      canDisplayAlerts: isDataQualityManager || isDataSupplier,
      canCreateDataset: isDataSupplier,
      canDownload: isDataUser,
      canAddRawLink: isDataSupplier && activeTab === "owned",
    });
  }, [auth, activeTab]);

  // --- Error Handling ---
  useEffect(() => {
    if (datasetListError) {
      toast.error(presenter.getErrorMessage(datasetListError));
    }
  }, [datasetListError, presenter]);

  // --- Callbacks / Actions ---
  const onFilterChange = useCallback(
    (filterKey: keyof DatasetFilter, newValue: string) => {
      setFilters((prev) => ({ ...prev, [filterKey]: newValue }));
    },
    [],
  );

  const resetFilters = useCallback(() => setFilters({}), []);

  const onTabChange = useCallback(
    (selectedTab: DatasetTab) => setActiveTab(selectedTab),
    [],
  );

  const onDatasetSelected = useCallback(
    (datasetId: string) => {
      const path =
        activeTab === "qualityControllable"
          ? `/dataset/${datasetId}/entries`
          : `/dataset/${datasetId}`;
      navigate(path);
    },
    [activeTab, navigate],
  );

  const onShowAlerts = useCallback(
    (datasetId: string) => {
      if (permissions.canDisplayAlerts)
        navigate(`/dataset/${datasetId}/alerts`);
    },
    [permissions.canDisplayAlerts, navigate],
  );

  // Akcje modala
  const onOpenAddModal = useCallback(() => setIsAddModalOpen(true), []);
  const onCloseAddModal = useCallback(() => setIsAddModalOpen(false), []);

  const onAddDataset = useCallback(
    (payload: CreateDatasetDto) => {
      const finalPayload = {
        ...payload,
        qualityControllable: false, // Dodajemy brakujące pole wymagane przez backend
      };
      addDatasetMutation.mutate(finalPayload);
    },
    [addDatasetMutation],
  );

  return {
    // Data
    datasets,
    filters,
    tabs,
    activeTab,
    permissions,

    // Loading states
    isDatasetsLoading,
    isCreating: addDatasetMutation.isPending,

    // Modal State
    isAddModalOpen,

    // Actions
    onFilterChange,
    onTabChange,
    resetFilters,
    onDatasetSelected,
    onShowAlerts,
    onAddDataset,
    onOpenAddModal,
    onCloseAddModal,
  };
}
