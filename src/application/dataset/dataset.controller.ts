import type {
  Dataset,
  DatasetSummary,
  CreateDatasetDto,
  UpdateDatasetDto,
  DatasetFilter,
  DatasetPreview,
} from "@/domain/dataset/dataset.types";
import type { CreateDatasetCommentDto } from "@/domain/quality/quality.type";
import DatasetUseCase from "@/domain/dataset/dataset.uc";
import QualityUseCase from "@/domain/quality/quality.uc";
import { useCallback, useEffect, useRef, useState } from "react";
import DatasetPresenter from "./dataset.presenter";
import { apiClient } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useDatasetController(
  datasetId: string | null,
  filter?: DatasetFilter,
) {
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);

  const deps = useRef<{
    datasetUseCase: DatasetUseCase;
    qualityUseCase: QualityUseCase;
    presenter: DatasetPresenter;
  } | null>(null);

  deps.current ??= {
    datasetUseCase: new DatasetUseCase(apiClient),
    qualityUseCase: new QualityUseCase(apiClient),
    presenter: new DatasetPresenter(),
  };

  const { datasetUseCase, qualityUseCase, presenter } = deps.current;
  const queryClient = useQueryClient();

  // List datasets query
  const { data: datasetsData, isLoading: isDatasetsLoading } = useQuery({
    queryKey: ["listDatasets", filter],
    queryFn: () => datasetUseCase.listDatasets(filter),
    select: (data) => presenter.listDatasets(data),
  });

  useEffect(() => {
    if (datasetsData) {
      setDatasets(datasetsData);
    }
  }, [datasetsData]);

  // Get single dataset query
  const {
    data: currentDatasetData,
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

  useEffect(() => {
    if (currentDatasetData) {
      setCurrentDataset(currentDatasetData);
    } else if (!datasetId) {
      setCurrentDataset(null);
    }
  }, [currentDatasetData, datasetId]);

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

  // Get dataset comments query
  const {
    data: datasetComments,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["getDatasetComments", datasetId],
    queryFn: () => qualityUseCase.loadDatasetComments(datasetId ?? "0"),
    select: (data) => presenter.listDatasetComments(data),
    enabled: !!datasetId,
    retry: false,
  });

  useEffect(() => {
    if (commentsError) {
      toast.error(presenter.getErrorMessage(commentsError));
    }
  }, [commentsError, presenter]);

  // Clear state when datasetId changes
  useEffect(() => {
    setCurrentDataset(null);
  }, [datasetId]);

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

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (comment: CreateDatasetCommentDto) =>
      qualityUseCase.addDatasetComment(datasetId ?? "0", comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getDatasetComments", datasetId],
      });
      toast.success("Comment added");
    },
    onError: (error) => {
      toast.error(presenter.getErrorMessage(error));
      console.error("addComment error", error);
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

  const onAddComment = useCallback(
    (comment: CreateDatasetCommentDto) => {
      addCommentMutation.mutate(comment);
    },
    [addCommentMutation],
  );

  const setSelectedDatasetId = useCallback(
    (newDatasetId: string) => {
      navigate(`/dataset/${newDatasetId}`);
    },
    [navigate],
  );

  // Fetch dataset preview on demand
  const onShowPreview = useCallback(
    async (previewId: string): Promise<DatasetPreview | null | undefined> => {
      try {
        await Promise.resolve();
        return {
          datasetId: previewId,
          title: currentDataset?.title ?? "",
          description: currentDataset?.description ?? "",
          entryCount: 0,
          sampleEntries: [],
        };
      } catch (error) {
        toast.error(presenter.getErrorMessage(error));
        return null;
      }
    },
    [currentDataset, presenter],
  );

  const onBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    // Data
    datasets,
    currentDataset,
    datasetDescription,
    datasetComments: datasetComments ?? [],
    datasetId,

    // Loading states
    isDatasetsLoading,
    isCurrentDatasetLoading,
    isDescriptionLoading,
    isCommentsLoading,
    isAddingDataset: addDatasetMutation.isPending,
    isEditingDataset: editDatasetMutation.isPending,
    isAddingComment: addCommentMutation.isPending,

    // Actions
    setSelectedDatasetId,
    onAddDatasetClick,
    onEditDatasetClick,
    onAddComment,
    onShowPreview,
    onBack,
  };
}
