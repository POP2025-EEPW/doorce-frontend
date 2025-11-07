import type {
  Dataset,
  DatasetDescription,
  DatasetPreview,
} from "@/domain/dataset/dataset.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/lib/components/ui/card";
import { Separator } from "@/ui/lib/components/ui/separator";
import { Button } from "@/ui/lib/components/ui/button";
import { useState } from "react";
import type { DatasetComment } from "@/domain/quality/quality.type";
import { DatasetPreviewView } from "../components/DatasetPreview.view";

export function DatasetInfoView({
  dataset,
  description,
  comments,
  onShowPreview,
}: {
  dataset: Dataset;
  description?: DatasetDescription;
  comments: DatasetComment[];
  onShowPreview: (
    previewId: string,
  ) => Promise<DatasetPreview | null | undefined>;
}) {
  const [preview, setPreview] = useState<DatasetPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePreviewClick = async () => {
    setError(null);
    setLoading(true);
    try {
      console.log("Fetching preview for dataset:", dataset.id);
      const data = await onShowPreview(dataset.id);
      if (!data) {
        console.warn("Preview is empty or not returned");
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="leading-none">{dataset.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm">Status: {dataset.status}</div>
        <Separator className="my-3" />

        {dataset.description && (
          <p className="text-muted-foreground">{dataset.description}</p>
        )}
        <Separator className="my-3" />

        {description && (
          <>
            <Separator className="my-3" />
            <div className="text-sm text-foreground">
              <strong>Detailed description:</strong>
              {description.description ? (
                <p className="mt-1 text-muted-foreground whitespace-pre-line">
                  {description.description}
                </p>
              ) : (
                <p className="mt-1 text-muted-foreground italic">
                  No additional description.
                </p>
              )}

              {description && (
                <>
                  <Separator className="my-3" />
                  <div className="text-sm text-foreground">
                    <strong>Detailed description:</strong>
                    {description.description ? (
                      <p className="mt-1 text-muted-foreground whitespace-pre-line">
                        {description.description}
                      </p>
                    ) : (
                      <p className="mt-1 text-muted-foreground italic">
                        No additional description.
                      </p>
                    )}
                  </div>
                  <Separator className="my-3" />

                  {error && (
                    <p className="text-sm text-red-600 mb-2">{error}</p>
                  )}

                  {preview ? (
                    <DatasetPreviewView
                      preview={preview}
                      onClose={() => setPreview(null)}
                    />
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePreviewClick}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Show dataset preview"}
                    </Button>
                  )}

                  <Separator className="my-3" />

                  <div>
                    <h4 className="text-md font-semibold mb-2">Comments</h4>
                    <div className="space-y-2">
                      {comments && comments.length > 0 ? (
                        comments.map((c) => (
                          <div
                            key={c.id}
                            className="p-2 rounded-md border border-border bg-muted/30"
                          >
                            <p className="text-sm">{c.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(c.createdAt).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No comments yet.
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
