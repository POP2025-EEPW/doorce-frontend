import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DatasetTableView } from "@/views/datasets/DatasetTable.view";
import { SelectDataSchemaModalPresenter } from "@/presenters/datasets/SelectDataSchemaModal.presenter";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SubcatalogListView } from "@/views/catalogs/SubcatalogList.view";
import * as CatalogController from "@/controllers/catalogs.controller";
import type { DatasetSummary } from "@/domain/types/dataset";
import { useState } from "react";

export function CatalogDetailsPresenter() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const catalogId = id ?? "";

  const [selectedDataset, setSelectedDataset] = useState<DatasetSummary | null>(
    null
  );

  const { data: catalog, isLoading: catLoading } = useQuery({
    queryKey: ["catalog", catalogId],
    queryFn: () => CatalogController.loadCatalog(catalogId),
    enabled: !!catalogId,
  });

  const { data: datasets, isLoading: listLoading } = useQuery({
    queryKey: ["catalogDatasets", catalogId, 1, 20],
    queryFn: () => CatalogController.loadCatalogDatasets(catalogId, 1, 20),
    enabled: !!catalogId,
  });

  const handleSchemaSuccess = () => {
    void qc.invalidateQueries({ queryKey: ["catalogDatasets", catalogId] });
    void qc.invalidateQueries({ queryKey: ["dataset", selectedDataset?.id] });
    setSelectedDataset(null);
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

      <DatasetTableView
        datasets={datasets ?? []}
        onOpen={(dsId) => nav(`/datasets/${dsId}`)}
        onEdit={(dataset) => nav(`/datasets/${dataset.id}/edit`)}
        onSetSchema={setSelectedDataset}
      />

      {selectedDataset && (
        <SelectDataSchemaModalPresenter
          open={true}
          datasetId={selectedDataset.id}
          onSuccess={handleSchemaSuccess}
          onCancel={() => setSelectedDataset(null)}
          onOpenChange={(open) => {
            if (!open) setSelectedDataset(null);
          }}
        />
      )}
    </div>
  );
}
