import { useForm } from "react-hook-form";
import { Label } from "@/ui/lib/components/ui/label";
import { Input } from "@/ui/lib/components/ui/input";
import { Textarea } from "@/ui/lib/components/ui/textarea";
import { Button } from "@/ui/lib/components/ui/button";
import type { CreateCatalogDto } from "@/domain/catalog/catalog.type";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/lib/components/ui/card";

interface AddDatasetFormViewProps {
  onAddDataset: (input: CreateCatalogDto) => void;
}

export function AddDatasetFormView(props: AddDatasetFormViewProps) {
  const { onAddDataset } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCatalogDto>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg leading-none">Add dataset</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-2"
          onSubmit={handleSubmit((data) => {
            onAddDataset(data);
            reset();
          })}
        >
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Dataset title"
              {...register("title", {
                required: {
                  value: true,
                  message: "Title is required",
                },
              })}
            />
            {errors.title && (
              <div className="text-sm text-destructive">
                {errors.title.message}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description (optional)"
              {...register("description", {
                required: {
                  value: true,
                  message: "Description is required",
                },
              })}
            />
            {errors.description && (
              <div className="text-sm text-destructive">
                {errors.description.message}
              </div>
            )}
          </div>
          <Button type="submit">Add Dataset</Button>
        </form>
      </CardContent>
    </Card>
  );
}
