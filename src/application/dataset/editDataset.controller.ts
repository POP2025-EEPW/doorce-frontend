// application/dataset/editDataset.controller.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import EditDatasetUseCase from "@/domain/dataset/editDataset.uc";
import EditDatasetPresenter, {
  type EditDatasetViewState,
} from "./editDatasetPresenter.ts";
import { apiClient } from "@/api/client";

import type {
  DatasetSummary,
  UpdateDatasetDto,
} from "@/domain/dataset/dataset.types";
import type { EditDatasetModalViewProps } from "@/ui/dataset/components/EditDatasetForm.view.tsx";

const initialState: EditDatasetViewState = {
  dataset: null,
  schemaName: null,
  isModalOpen: false,
  notification: null,
};

interface UseEditDatasetControllerInput {
  onDatasetUpdated?: () => void;
}

export function useEditDatasetController(
  input: UseEditDatasetControllerInput = {},
) {
  const { onDatasetUpdated } = input;

  const [state, setState] = useState<EditDatasetViewState>(initialState);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(
    null,
  );

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
  const { isLoading: isLoadingDataset, refetch: refetchDataset } = useQuery({
    queryKey: ["getDatasetForEdit", selectedDatasetId],
    queryFn: () => useCase.loadDataset(selectedDatasetId!),
    enabled: !!selectedDatasetId && state.isModalOpen,
    staleTime: 0,
    retry: false,
  });

  // Refetch when modal opens
  useEffect(() => {
    if (state.isModalOpen && selectedDatasetId) {
      refetchDataset();
    }
  }, [state.isModalOpen, selectedDatasetId, refetchDataset]);

  // Edit dataset mutation
  const editDatasetMutation = useMutation({
    mutationFn: (dto: UpdateDatasetDto) =>
      useCase.editDataset(selectedDatasetId!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listDatasets"] });
      queryClient.invalidateQueries({
        queryKey: ["getDataset", selectedDatasetId],
      });
      queryClient.invalidateQueries({ queryKey: ["listCatalogDatasets"] });

      if (onDatasetUpdated) {
        onDatasetUpdated();
      }
    },
  });

  // Action handlers
  const openEditModal = useCallback((dataset: DatasetSummary) => {
    setSelectedDatasetId(dataset.id);
    setState((prev) => ({
      ...prev,
      isModalOpen: true,
      notification: null,
      dataset: null,
      schemaName: null,
    }));
  }, []);

  const closeEditModal = useCallback(() => {
    setSelectedDatasetId(null);
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
      dataset: null,
      schemaName: null,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (data: UpdateDatasetDto) => {
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
    currentSchemaName: state.schemaName, // <-- z use case

    onClose: closeEditModal,
    onSubmit: handleSubmit,
  };

  return {
    viewProps,
    notification: state.notification,
    clearNotification,
    openEditModal,
  };
}
