import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as DatasetController from "@/controllers/datasets.controller";
import { DatasetsPageView } from "@/views/datasets/DatasetsPage.view";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/auth/auth-store";
import type { Dataset } from "@/domain/types/dataset";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// UI for loading/error kept here to decouple presenter logic from view

export function DatasetsPresenter() {
  const nav = useNavigate();
  const { userId } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["datasets"],
    queryFn: () => DatasetController.loadOwnedDatasets(userId ?? ""),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Skeleton className="h-10 w-full" />;
  if (error || !data)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load datasets.</AlertDescription>
      </Alert>
    );

  return (
    <DatasetsPageView
      datasets={data as Dataset[]}
      onOpenDataset={(id) => nav(`/datasets/${id}`)}
    />
  );
}
