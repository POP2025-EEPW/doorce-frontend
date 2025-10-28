import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loadDataset, updateDataset } from "@/controllers/datasets.controller";
import {
  loadDataSchemas,
  setDataSchemaForDataset,
} from "@/controllers/datasets.controller";
import { EditDatasetFormView } from "@/views/datasets/EditDatasetForm.view.tsx";
import { SelectDataSchemaModalView } from "@/views/datasets/SelectDataSchemaModal.view.tsx";
import type { UpdateDatasetInput } from "@/domain/types/dataset.ts";

export function DatasetEditPresenter() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);

  const { data: dataset, isLoading } = useQuery({
    queryKey: ["dataset", id],
    queryFn: () => loadDataset(id!),
    enabled: !!id,
  });

  const { data: schemas = [], isLoading: isSchemasLoading } = useQuery({
    queryKey: ["dataSchemas"],
    queryFn: loadDataSchemas,
    enabled: isModalOpen,
  });

  const { mutate } = useMutation({
    mutationFn: updateDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataset", id] });
      queryClient.invalidateQueries({ queryKey: ["datasets"] });
      navigate(`/datasets/${id}`);
    },
  });

  const { mutate: mutateSetSchema, isPending: isSettingSchema } = useMutation({
    mutationFn: ({
      datasetId,
      schemaId,
    }: {
      datasetId: string;
      schemaId: string;
    }) => setDataSchemaForDataset(datasetId, schemaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataset", id] });
      setIsModalOpen(false);
      setSelectedSchemaId(null);
    },
  });

  const handleSetSchema = () => {
    setIsModalOpen(true);
    setSelectedSchemaId(dataset?.schemaId ?? null);
  };

  const handleConfirmSchema = () => {
    if (selectedSchemaId && id) {
      mutateSetSchema({ datasetId: id, schemaId: selectedSchemaId });
    }
  };

  if (isLoading || !dataset) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  const currentSchema = dataset.schemaId
    ? schemas.find((s) => s.id === dataset.schemaId)
    : null;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Dataset</h1>
      <EditDatasetFormView
        dataset={dataset}
        onSubmit={(input: UpdateDatasetInput) => mutate({ id: id!, input })}
        onCancel={() => navigate(`/datasets/${id}`)}
        onSetSchema={handleSetSchema}
        currentSchemaName={currentSchema?.name}
      />

      <SelectDataSchemaModalView
        open={isModalOpen}
        schemas={schemas}
        selectedSchemaId={selectedSchemaId}
        isLoading={isSchemasLoading}
        isSaving={isSettingSchema}
        onSelectSchema={setSelectedSchemaId}
        onConfirm={handleConfirmSchema}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedSchemaId(null);
        }}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
