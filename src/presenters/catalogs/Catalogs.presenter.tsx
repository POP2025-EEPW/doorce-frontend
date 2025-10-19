import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uc } from "@/app/di";
import { CatalogListView } from "@/views/catalogs/CatalogList.view";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AddCatalogFormView } from "@/views/catalogs/AddCatalogForm.view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CatalogsPresenter() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["catalogs"],
    queryFn: () => uc.dataset.listCatalogs(null),
    staleTime: 5 * 60 * 1000,
  });

  const addCatalog = useMutation({
    mutationFn: uc.dataset.addCatalog,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["catalogs"] });
      nav(`/catalogs/${res.id}`);
    },
  });

  if (isLoading) return <Skeleton className="h-10 w-full" />;
  if (error || !data)
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load catalogs.</AlertDescription>
      </Alert>
    );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Catalogs</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Add root catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <AddCatalogFormView
            parentCatalogId={null}
            onSubmit={(input) => addCatalog.mutate(input)}
          />
        </CardContent>
      </Card>
      <CatalogListView
        catalogs={data}
        onOpen={(id) => nav(`/catalogs/${id}`)}
      />
    </div>
  );
}
