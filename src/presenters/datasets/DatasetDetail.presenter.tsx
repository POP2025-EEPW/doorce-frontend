import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { uc } from "@/app/di";
import { DatasetInfoView } from "@/views/datasets/DatasetInfo.view";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AddDatasetCommentPresenter } from "@/presenters/dataset-comments/AddDatasetComment.presenter.tsx";

export function DatasetDetailPresenter() {
  const { id } = useParams();
  const datasetId = id ?? "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["dataset", datasetId],
    queryFn: () => uc.dataset.getDataset(datasetId),
    enabled: !!datasetId,
  });

  if (!datasetId)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Missing dataset id.</AlertDescription>
      </Alert>
    );
  if (isLoading) return <Skeleton className="h-10 w-full" />;
  if (error || !data)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load dataset.</AlertDescription>
      </Alert>
    );

  return (
    <div>
      <DatasetInfoView dataset={data} />
      <AddDatasetCommentPresenter datasetId={datasetId} />
    </div>
  );
}
