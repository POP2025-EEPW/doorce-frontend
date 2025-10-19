import type {
  CatalogSummary,
  CreateCatalogInput,
} from "@/domain/types/dataset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCatalogFormView } from "@/views/catalogs/AddCatalogForm.view";
import { CatalogListView } from "@/views/catalogs/CatalogList.view";

export interface CatalogsPageViewProps {
  catalogs: CatalogSummary[];
  onOpenCatalog: (id: string) => void;
  onSubmitAddRoot: (input: CreateCatalogInput) => void | Promise<void>;
}

export function CatalogsPageView(props: CatalogsPageViewProps) {
  const { catalogs, onOpenCatalog, onSubmitAddRoot } = props;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Catalogs</h1>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-lg leading-none">
            Add root catalog
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddCatalogFormView
            parentCatalogId={null}
            onSubmit={onSubmitAddRoot}
          />
        </CardContent>
      </Card>
      <CatalogListView catalogs={catalogs} onOpen={onOpenCatalog} />
    </div>
  );
}
