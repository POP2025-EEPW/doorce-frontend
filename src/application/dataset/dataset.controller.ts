// dataset.controller.ts
import type {
  CreateDatasetDto,
  UpdateDatasetDto,
  DatasetFilter,
  DatasetPreview,
} from "@/domain/dataset/dataset.types";
import DatasetUseCase from "@/domain/dataset/dataset.uc";
import { useCallback, useEffect, useRef } from "react";
import DatasetPresenter from "./dataset.presenter";
import { apiClient } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useDatasetController(
  datasetId: string | null,
  filter?: DatasetFilter,
) {
  const navigate = useNavigate();

  const deps = useRef<{
    datasetUseCase: DatasetUseCase;
    presenter: DatasetPresenter;
  } | null>(null);

  deps.current ??= {
    datasetUseCase: new DatasetUseCase(apiClient),
    presenter: new DatasetPresenter(),
  };

  const { datasetUseCase, presenter } = deps.current;
  const queryClient = useQueryClient();

  // List datasets query
  const { data: datasets = [], isLoading: isDatasetsLoading } = useQuery({
    queryKey: ["listDatasets", filter],
    queryFn: () => datasetUseCase.listDatasets(filter),
    select: (data) => presenter.listDatasets(data),
  });

  // Get single dataset query
  const {
    data: currentDataset,
    isLoading: isCurrentDatasetLoading,
    error: datasetError,
  } = useQuery({
    queryKey: ["getDataset", datasetId],
    queryFn: () => datasetUseCase.getDataset(datasetId ?? "0"),
    select: (data) => presenter.getDataset(data),
    enabled: !!datasetId,
    retry: false,
  });

  useEffect(() => {
    if (datasetError) {
      toast.error(presenter.getErrorMessage(datasetError));
    }
  }, [datasetError, presenter]);

  // Get dataset description query
  const {
    data: datasetDescription,
    isLoading: isDescriptionLoading,
    error: descriptionError,
  } = useQuery({
    queryKey: ["getDatasetDescription", datasetId],
    queryFn: () => datasetUseCase.getDatasetDescription(datasetId ?? "0"),
    select: (data) => presenter.getDatasetDescription(data),
    enabled: !!datasetId,
    retry: false,
  });

  useEffect(() => {
    if (descriptionError) {
      toast.error(presenter.getErrorMessage(descriptionError));
    }
  }, [descriptionError, presenter]);

  // Add dataset mutation
  const addDatasetMutation = useMutation({
    mutationFn: (dataset: CreateDatasetDto) =>
      datasetUseCase.addDataset(dataset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listDatasets"] });
      queryClient.invalidateQueries({ queryKey: ["listCatalogDatasets"] });
      toast.success("Dataset created");
    },
    onError: (error) => {
      toast.error(presenter.getErrorMessage(error));
      console.error("addDataset error", error);
    },
  });

  // Edit dataset mutation
  const editDatasetMutation = useMutation({
    mutationFn: (vars: { id: string; dataset: UpdateDatasetDto }) =>
      datasetUseCase.editDataset(vars.id, vars.dataset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listDatasets"] });
      queryClient.invalidateQueries({ queryKey: ["getDataset", datasetId] });
      queryClient.invalidateQueries({ queryKey: ["listCatalogDatasets"] });
      toast.success("Dataset updated");
    },
    onError: (error) => {
      toast.error(presenter.getErrorMessage(error));
      console.error("editDataset error", error);
    },
  });

  const onAddDatasetClick = useCallback(
    (dataset: CreateDatasetDto) => {
      addDatasetMutation.mutate(dataset);
    },
    [addDatasetMutation],
  );

  const onEditDatasetClick = useCallback(
    (id: string, dataset: UpdateDatasetDto) => {
      editDatasetMutation.mutate({ id, dataset });
    },
    [editDatasetMutation],
  );

  const setSelectedDatasetId = useCallback(
    (newDatasetId: string) => {
      navigate(`/dataset/${newDatasetId}`);
    },
    [navigate],
  );

  // Fetch dataset preview on demand
  const onShowPreview = useCallback(
    async (previewId: string): Promise<DatasetPreview | null | undefined> => {
      try {
        await Promise.resolve();
        return {
          datasetId: previewId,
          title: currentDataset?.title ?? "",
          description: currentDataset?.description ?? "",
          entryCount: 0,
          sampleEntries: [],
        };
      } catch (error) {
        toast.error(presenter.getErrorMessage(error));
        return null;
      }
    },
    [currentDataset, presenter],
  );

  const onBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    // Data - directly from React Query
    datasets,
    currentDataset: currentDataset ?? null,
    datasetDescription,
    datasetId,

    // Loading states
    isDatasetsLoading,
    isCurrentDatasetLoading,
    isDescriptionLoading,
    isAddingDataset: addDatasetMutation.isPending,
    isEditingDataset: editDatasetMutation.isPending,

    // Actions
    setSelectedDatasetId,
    onAddDatasetClick,
    onEditDatasetClick,
    onShowPreview,
    onBack,
  };
}
