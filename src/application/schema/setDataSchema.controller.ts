// application/schema/setDatasetSchema.controller.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import SetDatasetSchemaUseCase from "@/domain/schema/setDatasetSchema.uc";
import SetDatasetSchemaPresenter, {
  type SetDatasetSchemaViewState,
} from "./setDatasetSchemaPresenter.ts";
import { apiClient } from "@/api/client";

import type { DatasetSummary } from "@/domain/dataset/dataset.types";
import type { SelectDataSchemaModalViewProps } from "@/ui/dataset/components/SelectDataSchemaModal.view";

const initialState: SetDatasetSchemaViewState = {
  dataset: null,
  schemas: [],
  isModalOpen: false,
  notification: null,
};

interface UseSetDatasetSchemaControllerInput {
  onSchemaUpdated?: () => void;
}

export function useSetDatasetSchemaController(
  input: UseSetDatasetSchemaControllerInput = {},
) {
  const { onSchemaUpdated } = input;

  const [state, setState] = useState<SetDatasetSchemaViewState>(initialState);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(
    null,
  );
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Initialize dependencies once
  const deps = useRef<{
    useCase: SetDatasetSchemaUseCase;
    presenter: SetDatasetSchemaPresenter;
  } | null>(null);

  if (!deps.current) {
    const presenter = new SetDatasetSchemaPresenter(setState);
    const useCase = new SetDatasetSchemaUseCase(apiClient, presenter);
    deps.current = { useCase, presenter };
  }

  const { useCase } = deps.current;

  // Clear notification
  const clearNotification = useCallback(() => {
    setState((prev) => ({ ...prev, notification: null }));
  }, []);

  // Load dataset query
  const { isLoading: isLoadingDataset, refetch: refetchDataset } = useQuery({
    queryKey: ["getDataset", selectedDatasetId],
    queryFn: () => useCase.loadDataset(selectedDatasetId!),
    enabled: !!selectedDatasetId && state.isModalOpen,
    staleTime: 0,
    retry: false,
  });

  // Load schemas query
  const { isLoading: isLoadingSchemas, refetch: refetchSchemas } = useQuery({
    queryKey: ["listDataSchemas"],
    queryFn: () => useCase.loadSchemas(),
    enabled: state.isModalOpen,
    staleTime: 0,
    retry: false,
  });

  // Refetch when modal opens
  useEffect(() => {
    if (state.isModalOpen) {
      refetchSchemas();
      if (selectedDatasetId) {
        refetchDataset();
      }
    }
  }, [state.isModalOpen, selectedDatasetId, refetchSchemas, refetchDataset]);

  // Sync selectedSchemaId when dataset loads
  useEffect(() => {
    if (state.dataset?.schemaId && selectedSchemaId === null) {
      setSelectedSchemaId(state.dataset.schemaId);
    }
  }, [state.dataset, selectedSchemaId]);

  // Set schema mutation
  const setSchemaMutation = useMutation({
    mutationFn: (schemaId: string | null) =>
      useCase.setSchema(selectedDatasetId!, schemaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listDatasets"] });
      queryClient.invalidateQueries({
        queryKey: ["getDataset", selectedDatasetId],
      });
      queryClient.invalidateQueries({ queryKey: ["listCatalogDatasets"] });

      if (onSchemaUpdated) {
        onSchemaUpdated();
      }
    },
  });

  // Action handlers
  const openSchemaModal = useCallback((dataset: DatasetSummary) => {
    setSelectedDatasetId(dataset.id);
    setSelectedSchemaId(null);
    setState((prev) => ({
      ...prev,
      isModalOpen: true,
      notification: null,
      dataset: null,
      schemas: [],
    }));
  }, []);

  const closeSchemaModal = useCallback(() => {
    setSelectedDatasetId(null);
    setSelectedSchemaId(null);
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
      dataset: null,
    }));
  }, []);

  const selectSchema = useCallback((schemaId: string) => {
    setSelectedSchemaId(schemaId);
  }, []);

  const confirmSchema = useCallback(() => {
    if (!selectedDatasetId) return;
    setSchemaMutation.mutate(selectedSchemaId);
  }, [selectedDatasetId, selectedSchemaId, setSchemaMutation]);

  // Build view props
  const viewProps: SelectDataSchemaModalViewProps = {
    open: state.isModalOpen,
    schemas: state.schemas,
    selectedSchemaId,
    isLoading: isLoadingSchemas || isLoadingDataset,
    isSaving: setSchemaMutation.isPending,
    onSelectSchema: selectSchema,
    onConfirm: confirmSchema,
    onCancel: closeSchemaModal,
    onOpenChange: (open) => {
      if (!open) closeSchemaModal();
    },
  };

  return {
    viewProps,
    notification: state.notification,
    clearNotification,
    openSchemaModal,
  };
}
