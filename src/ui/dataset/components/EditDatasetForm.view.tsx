import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { Label } from "@/ui/lib/components/ui/label";
import { Input } from "@/ui/lib/components/ui/input";
import { Textarea } from "@/ui/lib/components/ui/textarea";
import { Button } from "@/ui/lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/lib/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/lib/components/ui/select";

import type {
  DatasetStatus,
  UpdateDatasetDto,
} from "@/domain/dataset/dataset.types";
import type { ID } from "@/domain/common.types.ts";
export interface EditDatasetModalViewProps {
  isOpen: boolean;
  isPending: boolean;
  isLoadingDataset: boolean;

  initialTitle: string;
  initialDescription: string;
  initialStatus: DatasetStatus;
  initialCatalogId: ID;
  initialSchemaId: ID | null;
  currentSchemaName: string | null;

  onClose: () => void;
  onSubmit: (data: UpdateDatasetDto) => Promise<void>;
}

export function EditDatasetModalView(props: EditDatasetModalViewProps) {
  const {
    isOpen,
    isPending,
    isLoadingDataset,
    initialTitle,
    initialDescription,
    initialStatus,
    initialCatalogId,
    initialSchemaId,
    currentSchemaName,
    onClose,
    onSubmit,
  } = props;

  const { register, handleSubmit, formState, watch, setValue, reset } =
    useForm<UpdateDatasetDto>({
      defaultValues: {
        title: initialTitle,
        description: initialDescription,
        status: initialStatus,
        catalogId: initialCatalogId,
        schemaId: initialSchemaId,
      },
    });

  // Reset form when initial values change (when dataset is loaded)
  useEffect(() => {
    if (isOpen && !isLoadingDataset) {
      reset({
        title: initialTitle,
        description: initialDescription,
        status: initialStatus,
        catalogId: initialCatalogId,
        schemaId: initialSchemaId,
      });
    }
  }, [
    isOpen,
    isLoadingDataset,
    initialTitle,
    initialDescription,
    initialStatus,
    initialCatalogId,
    initialSchemaId,
    reset,
  ]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  const isDisabled = isPending || isLoadingDataset;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Dataset</DialogTitle>
        </DialogHeader>

        {isLoadingDataset ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading dataset...
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div className="space-y-1">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                placeholder="Dataset title"
                disabled={isDisabled}
                {...register("title", { required: true })}
              />
              {formState.errors.title && (
                <div className="text-sm text-destructive">
                  Title is required
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Dataset description"
                rows={4}
                disabled={isDisabled}
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
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(value) =>
                    setValue("status", value as DatasetStatus)
                  }
                  disabled={isDisabled}
                >
                  <SelectTrigger id="edit-status">
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

            {/* Hidden fields to preserve catalogId and schemaId */}
            <input type="hidden" {...register("catalogId")} />
            <input type="hidden" {...register("schemaId")} />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isDisabled}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
