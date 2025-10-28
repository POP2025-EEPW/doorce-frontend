import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { uc } from "@/app/di";
import { DatasetTableView } from "@/views/datasets/DatasetTable.view";
import { AddDatasetFormView } from "@/views/datasets/AddDatasetForm.view";
import { SelectDataSchemaModalView } from "@/views/datasets/SelectDataSchemaModal.view";
import { useAuth } from "@/auth/auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SubcatalogListView } from "@/views/catalogs/SubcatalogList.view";
import { AddSubcatalogCardView } from "@/views/catalogs/AddSubcatalogCard.view";
import { AddDatasetSectionView } from "@/views/datasets/AddDatasetSection.view";
import type { DatasetSummary } from "@/domain/types/dataset";

export function CatalogDetailPresenter() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { userId } = useAuth();
  const catalogId = id ?? "";

  const [selectedDataset, setSelectedDataset] = useState<DatasetSummary | null>(
    null,
  );
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);

  const { data: catalog, isLoading: catLoading } = useQuery({
    queryKey: ["catalog", catalogId],
    queryFn: () => uc.dataset.getCatalog(catalogId),
    enabled: !!catalogId,
  });

  const { data: datasets, isLoading: listLoading } = useQuery({
    queryKey: ["catalogDatasets", catalogId, 1, 20],
    queryFn: () => uc.dataset.listCatalogDatasets(catalogId, 1, 20),
    enabled: !!catalogId,
  });

  const { data: schemas = [], isLoading: isSchemasLoading } = useQuery({
    queryKey: ["dataSchemas"],
    queryFn: () => uc.dataset.listDataSchemas(),
    enabled: !!selectedDataset,
  });

  const addMutation = useMutation({
    mutationFn: uc.dataset.addDataset,
    onSuccess: (res) => {
      void qc.invalidateQueries({ queryKey: ["catalogDatasets", catalogId] });
      nav(`/datasets/${res.id}`);
    },
  });

  const { mutate: setSchemaMutate, isPending: isSettingSchema } = useMutation({
    mutationFn: ({
      datasetId,
      schemaId,
    }: {
      datasetId: string;
      schemaId: string;
    }) => uc.dataset.setDataSchemaForDataset(datasetId, schemaId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["catalogDatasets", catalogId] });
      void qc.invalidateQueries({ queryKey: ["dataset", selectedDataset?.id] });
      setSelectedDataset(null);
      setSelectedSchemaId(null);
    },
  });

  const handleSetSchema = (dataset: DatasetSummary) => {
    setSelectedDataset(dataset);
    setSelectedSchemaId(null);
  };

  const handleConfirmSchema = () => {
    if (selectedDataset && selectedSchemaId) {
      setSchemaMutate({
        datasetId: selectedDataset.id,
        schemaId: selectedSchemaId,
      });
    }
  };

  if (!catalogId)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Missing catalog id.</AlertDescription>
      </Alert>
    );
  if (catLoading || listLoading) return <Skeleton className="h-10 w-full" />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{catalog?.title ?? "Catalog"}</h1>
      <SubcatalogListView
        children={catalog?.children ?? []}
        onOpen={(childId) => nav(`/catalogs/${childId}`)}
      />
      <AddSubcatalogCardView
        parentCatalogId={catalogId}
        onSubmit={async (input) => {
          return uc.dataset.addCatalog(input).then(async () => {
            await qc.invalidateQueries({ queryKey: ["catalog", catalogId] });
            await qc.invalidateQueries({ queryKey: ["catalogs"] });
          });
        }}
      />
      <DatasetTableView
        datasets={datasets ?? []}
        onOpen={(dsId) => nav(`/datasets/${dsId}`)}
        onEdit={(dataset) => nav(`/datasets/${dataset.id}/edit`)}
        onSetSchema={handleSetSchema}
      />
      {userId && (
        <AddDatasetSectionView
          catalogId={catalogId}
          ownerId={userId}
          onSubmit={addMutation.mutate}
          FormComponent={(p) => (
            <AddDatasetFormView
              catalogId={p.catalogId}
              ownerId={p.ownerId}
              onSubmit={p.onSubmit}
            />
          )}
        />
      )}

      <SelectDataSchemaModalView
        open={!!selectedDataset}
        schemas={schemas}
        selectedSchemaId={selectedSchemaId}
        isLoading={isSchemasLoading}
        isSaving={isSettingSchema}
        onSelectSchema={setSelectedSchemaId}
        onConfirm={handleConfirmSchema}
        onCancel={() => {
          setSelectedDataset(null);
          setSelectedSchemaId(null);
        }}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDataset(null);
            setSelectedSchemaId(null);
          }
        }}
      />
    </div>
  );
}
