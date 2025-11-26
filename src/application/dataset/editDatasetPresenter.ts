import { useMemo } from "react";
import type { Dataset } from "@/domain/dataset/dataset.types";
import type { EditDatasetModalViewProps } from "@/ui/dataset/components/EditDatasetForm.view";

interface UseEditDatasetPresenterInput {
  dataset: Dataset | null;
  isOpen: boolean;
  isPending: boolean;
  isLoadingDataset: boolean;
  schemaName: string | null;
  onClose: () => void;
  onSubmit: EditDatasetModalViewProps["onSubmit"];
}

interface UseEditDatasetPresenterOutput {
  viewProps: EditDatasetModalViewProps;
}

export function useEditDatasetPresenter(
  input: UseEditDatasetPresenterInput,
): UseEditDatasetPresenterOutput {
  const {
    dataset,
    isOpen,
    isPending,
    isLoadingDataset,
    schemaName,
    onClose,
    onSubmit,
  } = input;

  const viewProps = useMemo<EditDatasetModalViewProps>(() => {
    return {
      isOpen,
      isPending,
      isLoadingDataset,
      initialTitle: dataset?.title ?? "",
      initialDescription: dataset?.description ?? "",
      initialStatus: dataset?.status ?? "draft",
      initialCatalogId: dataset?.catalogId ?? "",
      initialSchemaId: dataset?.schemaId ?? null,
      currentSchemaName: schemaName,
      onClose,
      onSubmit,
    };
  }, [
    dataset,
    isOpen,
    isPending,
    isLoadingDataset,
    schemaName,
    onClose,
    onSubmit,
  ]);

  return { viewProps };
}
