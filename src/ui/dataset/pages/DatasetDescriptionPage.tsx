import { DatasetDescriptionView } from "../components/DatasetDescription.view";
import { useDatasetController } from "@/application/dataset/dataset.controller";
import { useDataQualityController } from "@/application/dataquality/dataQuality.controller.ts";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/ui/lib/components/ui/skeleton";

export default function DatasetDescriptionPage() {
  const { id } = useParams<{ id: string }>();
  const datasetId = id ?? null;

  const {
    currentDataset,
    isCurrentDatasetLoading,
    isDescriptionLoading,
    onShowPreview,
    onBack,
  } = useDatasetController(datasetId);

  const {
    comments,
    isCommentsLoading,
    isAddingComment,
    isSettingQualityTag,
    onAddComment,
    onSetQualityTag,
  } = useDataQualityController(datasetId);

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
        comments={comments}
        onShowPreview={onShowPreview}
        onAddComment={onAddComment}
        onSetQualityTag={onSetQualityTag}
        isAddingComment={isAddingComment}
        isSettingQualityTag={isSettingQualityTag}
        onBack={onBack}
      />
    </main>
  );
}
