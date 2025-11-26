import DataQualityUseCases from "@/domain/quality/quality.uc";
import DataQualityPresenter from "./dataQuality.presenter";
import { apiClient } from "@/api/client";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { DatasetComment } from "@/domain/quality/quality.type";

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
  // const utils = useQueryClient();

  const { data: commentsData, isLoading } = useQuery({
    queryKey: ["loadDatasetComments", datasetId],
    queryFn: () => useCase.loadDatasetComments(datasetId!),
    select: (data) => presenter.listComments(data),
  });

  useEffect(() => {
    if (commentsData) {
      setComments(commentsData);
    }
  }, [setComments, commentsData]);

  return {
    comments,
    isLoading,
  };
}
