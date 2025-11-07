import { useForm } from "react-hook-form";
import { Label } from "@/ui/lib/components/ui/label";
import { Input } from "@/ui/lib/components/ui/input";
import { Textarea } from "@/ui/lib/components/ui/textarea";
import { Button } from "@/ui/lib/components/ui/button";
import type { CreateCatalogDto } from "@/domain/catalog/catalog.type";

interface AddCatalogFormViewProps {
  onAddCatalogClick: (data: CreateCatalogDto) => void;
}

export function AddCatalogFormView(props: AddCatalogFormViewProps) {
  const { onAddCatalogClick } = props;

  const { register, handleSubmit, formState, reset } =
    useForm<CreateCatalogDto>({});

  function onSubmitForm(data: CreateCatalogDto) {
    onAddCatalogClick(data);
    reset();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmitForm)}>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Catalog title"
          aria-invalid={!!formState.errors.title}
          {...register("title", { required: true })}
        />
        {formState.errors.title && (
          <div className="text-sm text-destructive">Title is required</div>
        )}
      </div>
      <div className="space-y-2">
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
