import { useMutation } from "@tanstack/react-query";
import { submitDatasetComment } from "@/controllers/dataset-comment.controller";
import { AddDatasetCommentFormView } from "@/views/dataset-comments/AddDatasetCommentForm.view";

interface AddDatasetCommentPresenterProps {
  datasetId: string;
}

export function AddDatasetCommentPresenter({
  datasetId,
}: AddDatasetCommentPresenterProps) {
  const { mutate: onSubmit, isPending } = useMutation({
    mutationFn: (text: string) => {
      if (!datasetId) throw new Error("Dataset ID is required");
      return submitDatasetComment(datasetId, text);
    },
    onSuccess: (result) => {
      console.log("Comment submitted with ID:", result.id);
    },
    onError: (error) => {
      console.error("Failed to submit comment:", error);
    },
  });

  return (
    <AddDatasetCommentFormView onSubmit={onSubmit} isSubmitting={isPending} />
  );
}
