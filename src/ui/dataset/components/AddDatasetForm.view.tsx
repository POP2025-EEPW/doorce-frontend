"use client";

import { useForm } from "react-hook-form";
import { Label } from "@/ui/lib/components/ui/label";
import { Input } from "@/ui/lib/components/ui/input";
import { Textarea } from "@/ui/lib/components/ui/textarea";
import { Button } from "@/ui/lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/lib/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/lib/components/ui/select";
import type { CreateDatasetDto } from "@/domain/dataset/dataset.types";

export interface AddDatasetModalViewProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDatasetDto) => void;
  schemas?: { id: string; name: string }[];
}

export function AddDatasetModalView({
  isOpen,
  isPending,
  onClose,
  onSubmit,
  schemas = [],
}: AddDatasetModalViewProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateDatasetDto>({
    defaultValues: {
      title: "",
      description: "",
      qualityControllable: false, // Zawsze false
      schemaId: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = handleSubmit((data) => {
    // Upewniamy się przed wysyłką, że pole jest ustawione
    onSubmit({ ...data, qualityControllable: false });
  });

  const schemaIdValue = watch("schemaId");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Dataset</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-5 py-4">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              disabled={isPending}
              {...register("title", { required: "Title is required" })}
              placeholder="Dataset title"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              disabled={isPending}
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="Dataset description..."
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="schema">Data Schema</Label>
            <Select
              disabled={isPending}
              value={schemaIdValue}
              onValueChange={(val) =>
                setValue("schemaId", val, { shouldValidate: true })
              }
            >
              <SelectTrigger id="schema">
                <SelectValue placeholder="Select a schema" />
              </SelectTrigger>
              <SelectContent>
                {schemas.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register("schemaId", { required: "Schema is required" })}
            />
            {errors.schemaId && (
              <p className="text-xs text-destructive">
                {errors.schemaId.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Dataset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
