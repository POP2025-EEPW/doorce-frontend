import { useForm } from "react-hook-form";
import type { CreateDatasetInput } from "@/domain/types/dataset";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function AddDatasetFormView({
  onSubmit,
  catalogId,
  ownerId,
}: {
  onSubmit: (input: CreateDatasetInput) => void | Promise<void>;
  catalogId: string;
  ownerId: string;
}) {
  const { register, handleSubmit, formState, reset } = useForm<{
    title: string;
    description?: string;
  }>({ defaultValues: { title: "", description: "" } });

  return (
    <form
      className="space-y-2"
      onSubmit={handleSubmit((v) => {
        onSubmit({
          title: v.title.trim(),
          description: v.description || undefined,
          catalogId,
          ownerId,
        });
        reset();
      })}
    >
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Dataset title"
          {...register("title", { required: true })}
        />
        {formState.errors.title && (
          <div className="text-sm text-destructive">Title is required</div>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description (optional)"
          {...register("description")}
        />
      </div>
      <Button type="submit">Add Dataset</Button>
    </form>
  );
}
