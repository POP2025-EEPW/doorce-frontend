import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { uc } from "@/app/di";
import { DatasetInfoView } from "@/views/datasets/DatasetInfo.view";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DatasetDetailPresenter() {
  const { id } = useParams();
  const datasetId = id ?? "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["dataset", datasetId],
    queryFn: () => uc.dataset.getDataset(datasetId),
    enabled: !!datasetId,
  });

  const {
    data: description,
    isLoading: descriptionLoading,
    error: descriptionError,
  } = useQuery({
    queryKey: ["datasetDescription", datasetId],
    queryFn: () => uc.dataset.getDatasetDescription(datasetId),
    enabled: !!datasetId,
  });

  if (!datasetId)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Missing dataset id.</AlertDescription>
      </Alert>
    );
  if (isLoading || descriptionLoading)
    return <Skeleton className="h-10 w-full" />;
  if (error || !data || descriptionError)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load dataset.</AlertDescription>
      </Alert>
    );

  return <DatasetInfoView dataset={data} description={description} />;
}
