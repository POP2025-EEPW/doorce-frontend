import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DatasetTableView } from "@/views/datasets/DatasetTable.view";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SubcatalogListView } from "@/views/catalogs/SubcatalogList.view";
import * as CatalogController from "@/controllers/catalogs.controller";

export function CatalogDetailsPresenter() {
  const { id } = useParams();
  const nav = useNavigate();
  const catalogId = id ?? "";

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
      />
    </div>
  );
}
