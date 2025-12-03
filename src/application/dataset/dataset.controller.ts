// dataset.controller.ts
import type {
  CreateDatasetDto,
  UpdateDatasetDto,
  DatasetPreview,
} from "@/domain/dataset/dataset.types";
import DatasetUseCase from "@/domain/dataset/dataset.uc";
import { useCallback, useEffect, useRef } from "react";
import DatasetPresenter from "./dataset.presenter";
import { apiClient } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import EntryUseCase from "@/domain/dataset/entry.uc.ts";

export function useDatasetController(datasetId: string | null) {
  const navigate = useNavigate();

  const deps = useRef<{
    datasetUseCase: DatasetUseCase;
    entryUseCase: EntryUseCase;
    presenter: DatasetPresenter;
  } | null>(null);

  deps.current ??= {
    datasetUseCase: new DatasetUseCase(apiClient),
    entryUseCase: new EntryUseCase(apiClient),
    presenter: new DatasetPresenter(),
  };

  const { datasetUseCase, entryUseCase, presenter } = deps.current;
  const queryClient = useQueryClient();

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

  const onShowPreview = useCallback(
    async (previewId: string): Promise<DatasetPreview | null | undefined> => {
      try {
        const entries = await entryUseCase.listEntries(previewId);
        console.log(entries[0].createdAt);
        const sampleEntries = entries.slice(0, 10).map((entry) => ({
          id: entry.id,
          content: entry.content,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
        }));
        console.log(sampleEntries[0].createdAt);
        return {
          datasetId: previewId,
          title: currentDataset?.title ?? "",
          description: currentDataset?.description ?? "",
          entryCount: entries.length,
          sampleEntries,
        };
      } catch (error) {
        toast.error(presenter.getErrorMessage(error));
        return null;
      }
    },
    [currentDataset, entryUseCase, presenter],
  );

  const onBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    // Data - directly from React Query
    currentDataset: currentDataset ?? null,
    datasetDescription,
    datasetId,

    // Loading states
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
