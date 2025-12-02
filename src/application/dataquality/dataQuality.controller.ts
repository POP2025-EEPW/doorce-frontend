// application/dataquality/dataQuality.controller.ts
import QualityUseCase from "@/domain/quality/quality.uc";
import DataQualityPresenter, {
  type QualityViewState,
} from "./dataQuality.presenter";
import { apiClient } from "@/api/client";
import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateDatasetCommentDto } from "@/domain/quality/quality.type";

const initialState: QualityViewState = {
  comments: [],
  notification: null,
};

export function useDataQualityController(datasetId: string | null) {
  const [state, setState] = useState<QualityViewState>(initialState);
  const queryClient = useQueryClient();

  // Initialize dependencies once
  const deps = useRef<{
    useCase: QualityUseCase;
    presenter: DataQualityPresenter;
  } | null>(null);

  if (!deps.current) {
    const presenter = new DataQualityPresenter(setState);
    const useCase = new QualityUseCase(apiClient, presenter);
    deps.current = { useCase, presenter };
  }

  const { useCase } = deps.current;

  // Clear notification
  const clearNotification = useCallback(() => {
    setState((prev) => ({ ...prev, notification: null }));
  }, []);

  // Load comments query
  const { isLoading: isCommentsLoading } = useQuery({
    queryKey: ["loadDatasetComments", datasetId],
    queryFn: () => useCase.loadDatasetComments(datasetId!),
    // No need for onSuccess/onError - use case handles it via presenter
    enabled: !!datasetId,
    retry: false,
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (comment: CreateDatasetCommentDto) =>
      useCase.addDatasetComment(datasetId ?? "0", comment),
    onSuccess: () => {
      // Only cache invalidation here - notification handled by use case -> presenter
      queryClient.invalidateQueries({
        queryKey: ["loadDatasetComments", datasetId],
      });
    },
    // No onError - handled by use case -> presenter
  });

  // Set quality tag mutation
  const setQualityTagMutation = useMutation({
    mutationFn: (qualityTag: string) =>
      useCase.setQualityTag(datasetId ?? "0", { qualityTag }),
    onSuccess: () => {
      // Only cache invalidation here
      queryClient.invalidateQueries({ queryKey: ["getDataset", datasetId] });
      queryClient.invalidateQueries({ queryKey: ["listDatasets"] });
    },
  });

  // Action handlers
  const onAddComment = useCallback(
    (comment: CreateDatasetCommentDto) => {
      addCommentMutation.mutate(comment);
    },
    [addCommentMutation],
  );

  const onSetQualityTag = useCallback(
    (qualityTag: string) => {
      setQualityTagMutation.mutate(qualityTag);
      console.log("controller");
    },
    [setQualityTagMutation],
  );

  return {
    // Data from presenter state
    comments: state.comments,
    notification: state.notification,
    clearNotification,

    // Loading states from React Query
    isCommentsLoading,
    isAddingComment: addCommentMutation.isPending,
    isSettingQualityTag: setQualityTagMutation.isPending,

    // Actions
    onAddComment,
    onSetQualityTag,
  };
}
