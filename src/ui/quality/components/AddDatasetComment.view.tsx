import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/lib/components/ui/card";
import { Button } from "@/ui/lib/components/ui/button";
import { Textarea } from "@/ui/lib/components/ui/textarea";
import { Label } from "@/ui/lib/components/ui/label";
import { useForm } from "react-hook-form";
import type { CreateDatasetCommentDto } from "@/domain/quality/quality.type";

interface AddDatasetCommentProps {
  onSubmit: (comment: CreateDatasetCommentDto) => void;
  isSubmitting?: boolean;
}

export function AddDatasetComment({
  onSubmit,
  isSubmitting = false,
}: AddDatasetCommentProps) {
  const { register, handleSubmit, formState, reset } =
    useForm<CreateDatasetCommentDto>({
      mode: "onChange",
    });

  const onSubmitForm = (data: CreateDatasetCommentDto) => {
    onSubmit(data);
    reset();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Add Comment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">
              Comment
              <span className="text-sm text-muted-foreground ml-2">
                (e.g. request for lacking data, report incorrect data)
              </span>
            </Label>
            <Textarea
              id="content"
              placeholder="Describe your comment or suggestion..."
              {...register("content", { required: true })}
              required
              rows={4}
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" disabled={isSubmitting || !formState.isValid}>
            {isSubmitting ? "Submitting..." : "Submit Comment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
