import { useMemo } from "react";
import type { Dataset } from "@/domain/dataset/dataset.types";
import type { DataSchema } from "@/domain/schema/schema.type";
import type { SelectDataSchemaModalViewProps } from "@/ui/dataset/components/SelectDataSchemaModal.view";

interface UseSetDatasetSchemaPresenterInput {
  isModalOpen: boolean;
  selectedDataset: Dataset | null;
  schemas: DataSchema[];
  selectedSchemaId: string | null;
  isLoadingSchemas: boolean;
  isLoadingDataset: boolean;
  isSaving: boolean;
  onSelectSchema: (schemaId: string) => void;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

interface UseSetDatasetSchemaPresenterOutput {
  viewProps: SelectDataSchemaModalViewProps;
}

export function useSetDatasetSchemaPresenter(
  input: UseSetDatasetSchemaPresenterInput,
): UseSetDatasetSchemaPresenterOutput {
  const {
    isModalOpen,
    schemas,
    selectedSchemaId,
    isLoadingSchemas,
    isLoadingDataset,
    isSaving,
    onSelectSchema,
    onConfirm,
    onClose,
  } = input;

  const viewProps = useMemo<SelectDataSchemaModalViewProps>(() => {
    return {
      open: isModalOpen,
      schemas,
      selectedSchemaId,
      isLoading: isLoadingSchemas || isLoadingDataset,
      isSaving,
      onSelectSchema,
      onConfirm,
      onCancel: onClose,
      onOpenChange: (open) => {
        if (!open) onClose();
      },
    };
  }, [
    isModalOpen,
    schemas,
    selectedSchemaId,
    isLoadingSchemas,
    isLoadingDataset,
    isSaving,
    onSelectSchema,
    onConfirm,
    onClose,
  ]);

  return { viewProps };
}
