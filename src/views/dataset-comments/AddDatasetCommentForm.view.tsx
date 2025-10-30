import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import type { Dataset } from "@/domain/types/dataset";

export function AddDatasetCommentFormView({
  dataset,
  onSubmit,
  isSubmitting = false,
}: {
  dataset?: Dataset;
  onSubmit: (text: string) => void;
  isSubmitting?: boolean;
}) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(comment);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Submit Dataset Comment</CardTitle>
        {dataset && (
          <CardDescription>
            Add a comment or suggestion for: <strong>{dataset.title}</strong>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment">
              Comment
              <span className="text-sm text-muted-foreground ml-2">
                (e.g. request for lacking data, report incorrect data)
              </span>
            </Label>
            <Textarea
              id="comment"
              placeholder="Describe your comment or suggestion..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={6}
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" disabled={isSubmitting || !comment.trim()}>
            {isSubmitting ? "Submitting..." : "Submit Comment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
