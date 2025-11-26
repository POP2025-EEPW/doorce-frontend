import { useState, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  Dataset,
  DatasetSummary,
  UpdateDatasetDto,
} from "@/domain/dataset/dataset.types";
import DatasetUseCase from "@/domain/dataset/dataset.uc";
import DatasetPresenter from "./dataset.presenter";
import { apiClient } from "@/api/client";

interface UseEditDatasetControllerInput {
  onDatasetUpdated?: (dataset: Dataset) => void;
}

interface UseEditDatasetControllerOutput {
  isModalOpen: boolean;
  selectedDataset: Dataset | null;
  isPending: boolean;
  isLoadingDataset: boolean;
  error: string | null;
  schemaName: string | null;

  openEditModal: (datasetSummary: DatasetSummary) => void;
  closeEditModal: () => void;
  submitEdit: (data: UpdateDatasetDto) => Promise<void>;
}

export function useEditDatasetController(
  input: UseEditDatasetControllerInput = {},
): UseEditDatasetControllerOutput {
  const { onDatasetUpdated } = input;
  const queryClient = useQueryClient();

  // Dependencies - same pattern as useDatasetController
  const deps = useRef<{
    datasetUseCase: DatasetUseCase;
    presenter: DatasetPresenter;
  } | null>(null);

  deps.current ??= {
    datasetUseCase: new DatasetUseCase(apiClient),
    presenter: new DatasetPresenter(),
  };

  const { datasetUseCase, presenter } = deps.current;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [schemaName, setSchemaName] = useState<string | null>(null);

  // Query to fetch full dataset when modal opens
  const { data: selectedDataset, isLoading: isLoadingDataset } = useQuery({
    queryKey: ["getDataset", selectedDatasetId],
    queryFn: () => datasetUseCase.getDataset(selectedDatasetId!),
    select: (data) => presenter.getDataset(data),
    enabled: !!selectedDatasetId && isModalOpen,
    retry: false,
  });

  // Edit mutation - same pattern as useDatasetController
  const editDatasetMutation = useMutation({
    mutationFn: (vars: { id: string; dataset: UpdateDatasetDto }) =>
      datasetUseCase.editDataset(vars.id, vars.dataset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listDatasets"] });
      queryClient.invalidateQueries({
        queryKey: ["getDataset", selectedDatasetId],
      });
      queryClient.invalidateQueries({ queryKey: ["listCatalogDatasets"] });
      toast.success("Dataset updated");

      if (selectedDataset && onDatasetUpdated) {
        onDatasetUpdated(selectedDataset);
      }
      closeEditModal();
    },
    onError: (err) => {
      const errorMessage = presenter.getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const openEditModal = useCallback((datasetSummary: DatasetSummary) => {
    setError(null);
    setSelectedDatasetId(datasetSummary.id);
    setIsModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDatasetId(null);
    setSchemaName(null);
    setError(null);
  }, []);

  const submitEdit = useCallback(
    async (data: UpdateDatasetDto) => {
      if (!selectedDatasetId) return;

      await editDatasetMutation.mutateAsync({
        id: selectedDatasetId,
        dataset: data,
      });
    },
    [selectedDatasetId, editDatasetMutation],
  );

  return {
    isModalOpen,
    selectedDataset: selectedDataset ?? null,
    isPending: editDatasetMutation.isPending,
    isLoadingDataset,
    error,
    schemaName,
    openEditModal,
    closeEditModal,
    submitEdit,
  };
}
