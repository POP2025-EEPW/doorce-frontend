import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uc } from "@/app/di";
import { DatasetTableView } from "@/views/datasets/DatasetTable.view";
import { AddDatasetFormView } from "@/views/datasets/AddDatasetForm.view";
import { useAuth } from "@/auth/auth-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AddCatalogFormView } from "@/views/catalogs/AddCatalogForm.view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CatalogDetailPresenter() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { userId } = useAuth();
  const catalogId = id as string;

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

  const addMutation = useMutation({
    mutationFn: uc.dataset.addDataset,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["catalogDatasets", catalogId] });
      nav(`/datasets/${res.id}`);
    },
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
      {catalog?.children && catalog.children.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subcatalogs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {catalog.children.map((c) => (
                <li key={c.id}>
                  <button
                    className="underline"
                    onClick={() => nav(`/catalogs/${c.id}`)}
                  >
                    {c.title}
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Add subcatalog</CardTitle>
        </CardHeader>
        <CardContent>
          <AddCatalogFormView
            parentCatalogId={catalogId}
            onSubmit={(input) => {
              return uc.dataset.addCatalog(input).then(() => {
                qc.invalidateQueries({ queryKey: ["catalog", catalogId] });
                qc.invalidateQueries({ queryKey: ["catalogs"] });
              });
            }}
          />
        </CardContent>
      </Card>
      <DatasetTableView
        datasets={datasets ?? []}
        onOpen={(dsId) => nav(`/datasets/${dsId}`)}
      />
      {userId && (
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-2">Add dataset</h2>
          <AddDatasetFormView
            catalogId={catalogId}
            ownerId={userId}
            onSubmit={(input) => addMutation.mutate(input)}
          />
        </div>
      )}
    </div>
  );
}
