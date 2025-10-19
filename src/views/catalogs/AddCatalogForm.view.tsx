import { useForm } from "react-hook-form";
import type { CreateCatalogInput } from "@/domain/types/dataset";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function AddCatalogFormView({
  onSubmit,
  parentCatalogId,
}: {
  onSubmit: (input: CreateCatalogInput) => void | Promise<void>;
  parentCatalogId: string | null;
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
          parentCatalogId,
        });
        reset();
      })}
    >
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Catalog title"
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
      <Button type="submit">Add Catalog</Button>
    </form>
  );
}
