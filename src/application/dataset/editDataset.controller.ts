// application/dataset/editDataset.controller.ts
import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import EditDatasetUseCase from "@/domain/dataset/editDataset.uc";
import EditDatasetPresenter, {
  type EditDatasetViewState,
} from "./editDatasetPresenter.ts";
import { apiClient } from "@/api/client";

import type {
  Dataset,
  DatasetSummary,
  UpdateDatasetDto,
} from "@/domain/dataset/dataset.types";
import type { EditDatasetModalViewProps } from "@/ui/dataset/components/EditDatasetForm.view";

const initialState: EditDatasetViewState = {
  dataset: null,
  isModalOpen: false,
  notification: null,
};

interface UseEditDatasetControllerInput {
  onDatasetUpdated?: (dataset: Dataset) => void;
}

export function useEditDatasetController(
  input: UseEditDatasetControllerInput = {},
) {
  const { onDatasetUpdated } = input;

  const [state, setState] = useState<EditDatasetViewState>(initialState);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(
    null,
  );
  const [schemaName, setSchemaName] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Initialize dependencies once
  const deps = useRef<{
    useCase: EditDatasetUseCase;
    presenter: EditDatasetPresenter;
  } | null>(null);

  if (!deps.current) {
    const presenter = new EditDatasetPresenter(setState);
    const useCase = new EditDatasetUseCase(apiClient, presenter);
    deps.current = { useCase, presenter };
  }

  const { useCase } = deps.current;

  // Clear notification
  const clearNotification = useCallback(() => {
    setState((prev) => ({ ...prev, notification: null }));
  }, []);

  // Load dataset query
  const { isLoading: isLoadingDataset } = useQuery({
    queryKey: ["getDataset", selectedDatasetId],
    queryFn: () => useCase.loadDataset(selectedDatasetId!),
    enabled: !!selectedDatasetId && state.isModalOpen,
    retry: false,
  });

  // Edit dataset mutation
  const editDatasetMutation = useMutation({
    mutationFn: (dto: UpdateDatasetDto) =>
      useCase.editDataset(selectedDatasetId!, dto),
    onSuccess: () => {
      // Only cache invalidation here - notification handled by use case -> presenter
      queryClient.invalidateQueries({ queryKey: ["listDatasets"] });
      queryClient.invalidateQueries({
        queryKey: ["getDataset", selectedDatasetId],
      });
      queryClient.invalidateQueries({ queryKey: ["listCatalogDatasets"] });

      if (state.dataset && onDatasetUpdated) {
        onDatasetUpdated(state.dataset);
      }
    },
    // No onError - handled by use case -> presenter
  });

  // Action handlers
  const openEditModal = useCallback(
    (datasetSummary: DatasetSummary) => {
      queryClient.invalidateQueries({
        queryKey: ["getDataset", datasetSummary.id],
      });

      setSelectedDatasetId(datasetSummary.id);
      setState((prev) => ({
        ...prev,
        isModalOpen: true,
        notification: null,
        dataset: null,
      }));
    },
    [queryClient],
  );

  const closeEditModal = useCallback(() => {
    setSelectedDatasetId(null);
    setSchemaName(null);
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
      dataset: null,
    }));
  }, []);

  const submitEdit = useCallback(
    async (data: UpdateDatasetDto): Promise<void> => {
      if (!selectedDatasetId) return;
      await editDatasetMutation.mutateAsync(data);
    },
    [selectedDatasetId, editDatasetMutation],
  );

  // Build view props
  const viewProps: EditDatasetModalViewProps = {
    isOpen: state.isModalOpen,
    isPending: editDatasetMutation.isPending,
    isLoadingDataset,
    initialTitle: state.dataset?.title ?? "",
    initialDescription: state.dataset?.description ?? "",
    initialStatus: state.dataset?.status ?? "draft",
    initialCatalogId: state.dataset?.catalogId ?? "",
    initialSchemaId: state.dataset?.schemaId ?? null,
    currentSchemaName: schemaName,
    onClose: closeEditModal,
    onSubmit: submitEdit,
  };

  return {
    // View props for modal
    viewProps,

    // Notification from presenter state
    notification: state.notification,
    clearNotification,

    // Actions
    openEditModal,
  };
}
