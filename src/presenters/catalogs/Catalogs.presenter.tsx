import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uc } from "@/app/di";
import { CatalogsPageView } from "@/views/catalogs/CatalogsPage.view";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// UI for loading/error kept here to decouple presenter logic from view

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
    <CatalogsPageView
      catalogs={data}
      onOpenCatalog={(id) => nav(`/catalogs/${id}`)}
      onSubmitAddRoot={addCatalog.mutate}
    />
  );
}
