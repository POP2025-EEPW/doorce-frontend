import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as DatasetController from "@/controllers/datasets.controller";
import { DatasetInfoView } from "@/views/datasets/DatasetInfo.view";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AddDatasetCommentPresenter } from "@/presenters/dataset-comments/AddDatasetComment.presenter.tsx";

export function DatasetDetailsPresenter() {
  const { id } = useParams();
  const datasetId = id ?? "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["dataset", datasetId],
    queryFn: () => DatasetController.loadDataset(datasetId),
    enabled: !!datasetId,
  });

  const {
    data: description,
    isLoading: descriptionLoading,
    error: descriptionError,
  } = useQuery({
    queryKey: ["datasetDescription", datasetId],
    queryFn: () => DatasetController.getDatasetDescription(datasetId),
    enabled: !!datasetId,
  });

  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["datasetComments", datasetId],
    queryFn: () => DatasetController.loadDatasetComments(datasetId),
    enabled: !!datasetId,
  });

  const handleShowPreview = async (id: string) => {
    return await DatasetController.getDatasetPreview(id);
  };

  if (isLoading || descriptionLoading || commentsLoading)
    return <Skeleton className="h-10 w-full" />;

  if (error || !data || descriptionError || commentsError)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load dataset or comments.</AlertDescription>
      </Alert>
    );


  return (
    <div>
      <DatasetInfoView 
        dataset={data} 
        description={description}
        comments={comments}
        onShowPreview={handleShowPreview}
      />
      <AddDatasetCommentPresenter datasetId={datasetId} />
    </div>
  );
}
