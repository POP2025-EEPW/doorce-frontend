import { useCallback, useRef, useState } from "react";
import type { DatasetSummary } from "@/domain/dataset/dataset.types.ts";
import type { ID } from "@/domain/common.types.ts";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/client.ts";
import DatasetUseCase from "@/domain/dataset/dataset.uc.ts";
import { toast } from "sonner";
import UploadRawDatasetPresenter from "@/application/dataset/uploadRawDataset.presenter.ts";

export function useUploadRawDatasetController() {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<ID | null>(null);

  const deps = useRef<{
    datasetUseCase: DatasetUseCase;
    presenter: UploadRawDatasetPresenter;
  } | null>(null);

  deps.current ??= {
    datasetUseCase: new DatasetUseCase(apiClient),
    presenter: new UploadRawDatasetPresenter(),
  };

  const { datasetUseCase, presenter } = deps.current;

  const uploadRawDataset = useMutation({
    mutationFn: (url: string) =>
      datasetUseCase.uploadRawDataset(selectedDatasetId ?? "", url),
    onSuccess: () => {
      setSelectedDatasetId(null);
      setOpen(false);
      toast.success("Raw dataset upload successfully.");
    },
    onError: (error) => {
      setSelectedDatasetId(null);
      setOpen(false);
      toast.error(presenter.getErrorMessage(error));
    },
  });

  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open);
    if (!open) {
      setSelectedDatasetId(null);
    }
  }, []);

  const openUploadRawModal = useCallback(
    (dataset: DatasetSummary) => {
      setSelectedDatasetId(dataset.id);
      setOpen(true);
    },
    [setSelectedDatasetId],
  );

  const onConfirm = useCallback(
    (url: string) => {
      uploadRawDataset.mutate(url);
    },
    [uploadRawDataset],
  );

  return {
    viewProps: {
      open,
      onOpenChange,
      onConfirm,
      isLoading: uploadRawDataset.isPending,
    },

    openUploadRawModal,
  };
}
