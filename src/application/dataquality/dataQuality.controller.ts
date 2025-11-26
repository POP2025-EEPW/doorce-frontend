import DataQualityUseCases from "@/domain/quality/quality.uc";
import DataQualityPresenter from "./dataQuality.presenter";
import { apiClient } from "@/api/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  DatasetComment,
  CreateDatasetCommentDto,
} from "@/domain/quality/quality.type";

export function useDataQualityController(datasetId: string | null) {
  const [comments, setComments] = useState<DatasetComment[]>([]);

  const deps = useRef<{
    useCase: DataQualityUseCases;
    presenter: DataQualityPresenter;
  } | null>(null);

  deps.current ??= {
    useCase: new DataQualityUseCases(apiClient),
    presenter: new DataQualityPresenter(),
  };

  const { useCase, presenter } = deps.current;
  const queryClient = useQueryClient();

  // Load comments query
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["loadDatasetComments", datasetId],
    queryFn: () => useCase.loadDatasetComments(datasetId!),
    select: (data) => presenter.listComments(data),
    enabled: !!datasetId,
    retry: false,
  });

  useEffect(() => {
    if (commentsData) {
      setComments(commentsData);
    }
  }, [commentsData]);

  useEffect(() => {
    if (commentsError) {
      toast.error(presenter.getErrorMessage(commentsError));
    }
  }, [commentsError, presenter]);

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (comment: CreateDatasetCommentDto) =>
      useCase.addDatasetComment(datasetId ?? "0", comment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["loadDatasetComments", datasetId],
      });
      toast.success("Comment added");
    },
    onError: (error) => {
      toast.error(presenter.getErrorMessage(error));
      console.error("addComment error", error);
    },
  });

  // Set quality tag mutation
  const setQualityTagMutation = useMutation({
    mutationFn: (qualityTag: string) =>
      useCase.setQualityTag(datasetId ?? "0", { qualityTag: qualityTag }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDataset", datasetId] });
      queryClient.invalidateQueries({ queryKey: ["listDatasets"] });
      toast.success("Quality tag updated");
    },
    onError: (error) => {
      toast.error(presenter.getErrorMessage(error));
      console.error("setQualityTag error", error);
    },
  });

  const onAddComment = useCallback(
    (comment: CreateDatasetCommentDto) => {
      addCommentMutation.mutate(comment);
    },
    [addCommentMutation],
  );

  const onSetQualityTag = useCallback(
    (qualityTag: string) => {
      setQualityTagMutation.mutate(qualityTag);
    },
    [setQualityTagMutation],
  );

  return {
    // Data
    comments,
    commentsError,

    // Loading states
    isCommentsLoading,
    isAddingComment: addCommentMutation.isPending,
    isSettingQualityTag: setQualityTagMutation.isPending,

    // Actions
    onAddComment,
    onSetQualityTag,
  };
}
