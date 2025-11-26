import { DatasetDescriptionView } from "../components/DatasetDescription.view";
import { useDatasetController } from "@/application/dataset/dataset.controller";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/ui/lib/components/ui/skeleton";

export default function DatasetDescriptionPage() {
  const { id } = useParams<{ id: string }>();
  const datasetId = id ?? null;

  const {
    currentDataset,
    datasetComments,
    isCurrentDatasetLoading,
    isDescriptionLoading,
    isCommentsLoading,
    onShowPreview,
    onBack,
  } = useDatasetController(datasetId);

  const isLoading =
    isCurrentDatasetLoading || isDescriptionLoading || isCommentsLoading;

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="container mx-auto py-6 space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </main>
    );
  }

  if (!currentDataset) {
    return (
      <main className="flex-1">
        <div className="container mx-auto py-6">
          <p className="text-muted-foreground">Dataset not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <DatasetDescriptionView
        dataset={currentDataset}
        comments={datasetComments}
        onShowPreview={onShowPreview}
        onBack={onBack}
      />
    </main>
  );
}
