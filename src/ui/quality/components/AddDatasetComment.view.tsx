import { Button } from "@/ui/lib/components/ui/button";
import { Textarea } from "@/ui/lib/components/ui/textarea";
import { Label } from "@/ui/lib/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/lib/components/ui/card";
import type { Dataset } from "@/domain/dataset/dataset.types";
import { useForm } from "react-hook-form";
import type { CreateDatasetCommentDto } from "@/domain/quality/quality.type";
import { Input } from "@/ui/lib/components/ui/input";

export function AddDatasetCommentFormView({
  dataset,
  onSubmit,
  isSubmitting = false,
}: {
  dataset?: Dataset;
  onSubmit: (data: CreateDatasetCommentDto) => void;
  isSubmitting?: boolean;
}) {
  const { register, handleSubmit, formState, reset } =
    useForm<CreateDatasetCommentDto>({});

  function onSubmitForm(data: CreateDatasetCommentDto) {
    onSubmit(data);
    reset();
  }

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
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
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
              {...register("content", { required: true })}
              required
              rows={6}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Input
              id="priority"
              type="number"
              placeholder="Priority"
              {...register("priority", { required: true, min: 1, max: 10 })}
            />
            {formState.errors.priority && (
              <div className="text-sm text-destructive">
                Priority is required and must be between 1 and 10
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting || !formState.isValid}>
            {isSubmitting ? "Submitting..." : "Submit Comment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
