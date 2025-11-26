import { useState, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Dataset, DatasetSummary } from "@/domain/dataset/dataset.types";
import type { DataSchema } from "@/domain/schema/schema.type";
import DatasetUseCase from "@/domain/dataset/dataset.uc";
import SchemaUseCase from "@/domain/schema/schema.uc";
import DatasetPresenter from "@/application/dataset/dataset.presenter.ts";
import { apiClient } from "@/api/client";

interface UseSetDatasetSchemaControllerInput {
  onSchemaUpdated?: () => void;
}

interface UseSetDatasetSchemaControllerOutput {
  isModalOpen: boolean;
  selectedDataset: Dataset | null;
  schemas: DataSchema[];
  selectedSchemaId: string | null;
  isLoadingSchemas: boolean;
  isLoadingDataset: boolean;
  isSaving: boolean;

  openSchemaModal: (dataset: DatasetSummary) => void;
  closeSchemaModal: () => void;
  selectSchema: (schemaId: string) => void;
  confirmSchema: () => Promise<void>;
}

export function useSetDatasetSchemaController(
  input: UseSetDatasetSchemaControllerInput = {},
): UseSetDatasetSchemaControllerOutput {
  const { onSchemaUpdated } = input;
  const queryClient = useQueryClient();

  const deps = useRef<{
    datasetUseCase: DatasetUseCase;
    schemaUseCase: SchemaUseCase;
    presenter: DatasetPresenter;
  } | null>(null);

  deps.current ??= {
    datasetUseCase: new DatasetUseCase(apiClient),
    schemaUseCase: new SchemaUseCase(apiClient),
    presenter: new DatasetPresenter(),
  };

  const { datasetUseCase, schemaUseCase, presenter } = deps.current;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(
    null,
  );
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);

  // Fetch full dataset to get current schemaId
  const { data: selectedDataset, isLoading: isLoadingDataset } = useQuery({
    queryKey: ["getDataset", selectedDatasetId],
    queryFn: () => datasetUseCase.getDataset(selectedDatasetId!),
    select: (data) => presenter.getDataset(data),
    enabled: !!selectedDatasetId && isModalOpen,
    retry: false,
  });

  // Fetch schemas when modal is open
  const { data: schemas = [], isLoading: isLoadingSchemas } = useQuery({
    queryKey: ["listDataSchemas"],
    queryFn: () => schemaUseCase.listSchemas(),
    enabled: isModalOpen,
  });

  // Update selectedSchemaId when dataset is loaded
  if (
    selectedDataset &&
    selectedSchemaId === null &&
    selectedDataset.schemaId
  ) {
    setSelectedSchemaId(selectedDataset.schemaId);
  }

  // Mutation to update dataset schema using dedicated endpoint
  const setSchemaMutation = useMutation({
    mutationFn: (vars: { datasetId: string; schemaId: string | null }) =>
      datasetUseCase.setSchema(vars.datasetId, vars.schemaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listDatasets"] });
      queryClient.invalidateQueries({
        queryKey: ["getDataset", selectedDatasetId],
      });
      queryClient.invalidateQueries({ queryKey: ["listCatalogDatasets"] });
      toast.success("Schema assigned successfully");

      if (onSchemaUpdated) {
        onSchemaUpdated();
      }
      closeSchemaModal();
    },
    onError: (err) => {
      const errorMessage = presenter.getErrorMessage(err);
      toast.error(errorMessage);
    },
  });

  const openSchemaModal = useCallback((dataset: DatasetSummary) => {
    setSelectedDatasetId(dataset.id);
    setIsModalOpen(true);
  }, []);

  const closeSchemaModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDatasetId(null);
    setSelectedSchemaId(null);
  }, []);

  const selectSchema = useCallback((schemaId: string) => {
    setSelectedSchemaId(schemaId);
  }, []);

  const confirmSchema = useCallback(async () => {
    if (!selectedDatasetId) return;

    await setSchemaMutation.mutateAsync({
      datasetId: selectedDatasetId,
      schemaId: selectedSchemaId,
    });
  }, [selectedDatasetId, selectedSchemaId, setSchemaMutation]);

  return {
    isModalOpen,
    selectedDataset: selectedDataset ?? null,
    schemas,
    selectedSchemaId,
    isLoadingSchemas,
    isLoadingDataset,
    isSaving: setSchemaMutation.isPending,
    openSchemaModal,
    closeSchemaModal,
    selectSchema,
    confirmSchema,
  };
}
