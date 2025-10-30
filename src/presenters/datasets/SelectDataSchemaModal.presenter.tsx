import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SelectDataSchemaModalView } from "@/views/datasets/SelectDataSchemaModal.view";
import {
  loadDataSchemas,
  setDataSchemaForDataset,
} from "@/controllers/datasets.controller";

export interface SelectDataSchemaModalPresenterProps {
  open: boolean;
  datasetId: string;
  onSuccess?: () => void;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
}

export function SelectDataSchemaModalPresenter({
  open,
  datasetId,
  onSuccess,
  onCancel,
  onOpenChange,
}: SelectDataSchemaModalPresenterProps) {
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);

  // Load available schemas
  const { data: schemas = [], isLoading } = useQuery({
    queryKey: ["dataSchemas"],
    queryFn: loadDataSchemas,
    enabled: open, // Only fetch when modal is open
  });

  // Mutation to assign schema to dataset
  const { mutate: assignSchema, isPending: isSaving } = useMutation({
    mutationFn: () => setDataSchemaForDataset(datasetId, selectedSchemaId!),
    onSuccess: () => {
      onSuccess?.();
      setSelectedSchemaId(null);
    },
  });

  const handleConfirm = () => {
    if (selectedSchemaId) {
      assignSchema();
    }
  };

  const handleCancel = () => {
    setSelectedSchemaId(null);
    onCancel();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedSchemaId(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <SelectDataSchemaModalView
      open={open}
      schemas={schemas}
      selectedSchemaId={selectedSchemaId}
      isLoading={isLoading}
      isSaving={isSaving}
      onSelectSchema={setSelectedSchemaId}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      onOpenChange={handleOpenChange}
    />
  );
}
