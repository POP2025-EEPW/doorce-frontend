import { useForm } from "react-hook-form";

import { Label } from "@/ui/lib/components/ui/label";
import { Input } from "@/ui/lib/components/ui/input";
import { Textarea } from "@/ui/lib/components/ui/textarea";
import { Button } from "@/ui/lib/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/lib/components/ui/select";
import type {
  Dataset,
  DatasetStatus,
  UpdateDatasetDto,
} from "@/domain/dataset/dataset.types";

interface EditDatasetFormViewProps {
  dataset: Dataset;
  currentSchemaName?: string;
  isPending: boolean;
  onCancel: () => void;
  onSetSchema: (schemaId: string) => void;
  onSubmit: (input: UpdateDatasetDto) => void;
}

export function EditDatasetFormView(props: EditDatasetFormViewProps) {
  const { dataset, currentSchemaName, onCancel, onSubmit } = props;

  const { register, handleSubmit, formState, watch, setValue } =
    useForm<UpdateDatasetDto>({
      defaultValues: {
        title: dataset.title,
        description: dataset.description,
        status: dataset.status,
      },
    });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((data) => {
        void onSubmit(data);
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
          placeholder="Dataset description"
          rows={4}
          {...register("description", { required: true })}
        />
        {formState.errors.description && (
          <div className="text-sm text-destructive">
            Description is required
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="status">Status</Label>
          <Select
            value={watch("status")}
            onValueChange={(value) =>
              setValue("status", value as DatasetStatus)
            }
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Data Schema</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm text-muted-foreground">
              {currentSchemaName ?? "No schema assigned"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">Save Changes</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
