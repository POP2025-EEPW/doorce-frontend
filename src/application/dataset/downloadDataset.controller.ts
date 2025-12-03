import { useCallback, useEffect, useRef, useState } from "react";
import type { DatasetSummary } from "@/domain/dataset/dataset.types.ts";
import type { ID } from "@/domain/common.types.ts";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client.ts";
import DatasetUseCase from "@/domain/dataset/dataset.uc.ts";
import DownloadDatasetPresenter from "@/application/dataset/downloadDataset.presenter.ts";
import { toast } from "sonner";

export function useDownloadDatasetController() {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<ID | null>(null);

  const deps = useRef<{
    datasetUseCase: DatasetUseCase;
    presenter: DownloadDatasetPresenter;
  } | null>(null);

  deps.current ??= {
    datasetUseCase: new DatasetUseCase(apiClient),
    presenter: new DownloadDatasetPresenter(),
  };

  const { datasetUseCase, presenter } = deps.current;

  const { data: downloadLink = "", error: downloadLinkError } = useQuery({
    queryKey: ["downloadDataset", selectedDatasetId],
    queryFn: () => datasetUseCase.downloadDataset(selectedDatasetId ?? ""),
    select: (data) => presenter.downloadDataset(data),
    enabled: selectedDatasetId != null,
    retry: false,
  });

  useEffect(() => {
    if (downloadLinkError) {
      setOpen(false);
      setSelectedDatasetId(null);
      toast.error(presenter.getErrorMessage(downloadLinkError));
    }
  }, [downloadLinkError, presenter]);

  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open);
    if (!open) {
      setSelectedDatasetId(null);
    }
  }, []);

  const openDownloadModal = useCallback(
    (dataset: DatasetSummary) => {
      setSelectedDatasetId(dataset.id);
      setOpen(true);
    },
    [setSelectedDatasetId],
  );

  return {
    viewProps: {
      open,
      onOpenChange,
      downloadUrl: downloadLink,
    },

    openDownloadModal,
  };
}
