import type { Dataset, DatasetPreview } from "@/domain/dataset/dataset.types";
import type {
  CreateDatasetCommentDto,
  DatasetComment,
} from "@/domain/quality/quality.type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/lib/components/ui/card";
import { Separator } from "@/ui/lib/components/ui/separator";
import { Button } from "@/ui/lib/components/ui/button";
import { Badge } from "@/ui/lib/components/ui/badge";
import { useState } from "react";
import { DatasetPreviewView } from "./DatasetPreview.view";
import { AddDatasetComment } from "@/ui/quality/components/AddDatasetComment.view.tsx";
import { AddQualityTagModal } from "@/ui/quality/components/AddQualityTagModal.tsx";

interface DatasetDescriptionViewProps {
  dataset: Dataset;
  comments: DatasetComment[];
  onShowPreview: (
    previewId: string,
  ) => Promise<DatasetPreview | null | undefined>;
  onAddComment: (comment: CreateDatasetCommentDto) => void;
  onSetQualityTag: (tag: string) => void;
  isAddingComment?: boolean;
  isSettingQualityTag?: boolean;
  onBack?: () => void;
}

export function DatasetDescriptionView({
  dataset,
  comments,
  onShowPreview,
  onAddComment,
  onSetQualityTag,
  isAddingComment = false,
  isSettingQualityTag = false,
  onBack,
}: DatasetDescriptionViewProps) {
  const [preview, setPreview] = useState<DatasetPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQualityTagModalOpen, setIsQualityTagModalOpen] = useState(false);

  const handlePreviewClick = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await onShowPreview(dataset.id);
      if (!data) {
        setError("Preview not available for this dataset.");
        setPreview(null);
      } else {
        setPreview(data);
      }
    } catch (err) {
      console.error("Error loading preview:", err);
      setError("Failed to load dataset preview.");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          &larr; Back to datasets
        </Button>
      )}

      {/* Main Info Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{dataset.title}</CardTitle>
            {dataset.status && (
              <Badge variant={getStatusVariant(dataset.status)}>
                {dataset.status}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {dataset.description && (
            <p className="text-muted-foreground">{dataset.description}</p>
          )}

          <Separator />

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Dataset ID</span>
              <p className="font-mono">{dataset.id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Catalog ID</span>
              <p className="font-mono">{dataset.catalogId}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Owner ID</span>
              <p className="font-mono">{dataset.ownerId}</p>
            </div>
            {dataset.schemaId && (
              <div>
                <span className="text-muted-foreground">Schema ID</span>
                <p className="font-mono">{dataset.schemaId}</p>
              </div>
            )}
          </div>

          {(dataset.createdAt ?? dataset.updatedAt) && (
            <>
              <Separator />
              <div className="flex gap-6 text-sm">
                {dataset.createdAt && (
                  <div>
                    <span className="text-muted-foreground">Created at: </span>
                    <span>{new Date(dataset.createdAt).toLocaleString()}</span>
                  </div>
                )}
                {dataset.updatedAt && (
                  <div>
                    <span className="text-muted-foreground">Updated at: </span>
                    <span>{new Date(dataset.updatedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quality Tag Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Quality Tag</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dataset.qualityTag ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-muted-foreground text-sm">
                  Current tag:{" "}
                </span>
                <Badge variant="secondary" className="text-base">
                  {dataset.qualityTag}
                </Badge>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsQualityTagModalOpen(true)}
              >
                Update Tag
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-muted-foreground italic">
                No quality tag set for this dataset.
              </p>
              <Button onClick={() => setIsQualityTagModalOpen(true)}>
                Set Quality Tag
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Data Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}

          {preview ? (
            <DatasetPreviewView
              preview={preview}
              onClose={() => setPreview(null)}
            />
          ) : (
            <Button
              variant="outline"
              onClick={handlePreviewClick}
              disabled={loading}
            >
              {loading ? "Loading..." : "Show dataset preview"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Comments Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            Comments {comments.length > 0 && `(${comments.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 rounded-md border border-border bg-muted/30"
                >
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No comments yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Add Comment Card */}
      <AddDatasetComment
        onSubmit={onAddComment}
        isSubmitting={isAddingComment}
      />

      {/* Quality Tag Modal */}
      <AddQualityTagModal
        open={isQualityTagModalOpen}
        onOpenChange={setIsQualityTagModalOpen}
        onSubmit={onSetQualityTag}
        isSubmitting={isSettingQualityTag}
        currentTag={dataset.qualityTag}
      />
    </div>
  );
}
