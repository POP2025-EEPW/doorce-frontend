import type { CreateCatalogInput } from "@/domain/types/dataset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCatalogFormView } from "@/views/catalogs/AddCatalogForm.view";

export interface AddSubcatalogCardViewProps {
  parentCatalogId: string;
  onSubmit: (input: CreateCatalogInput) => void | Promise<void>;
}

export function AddSubcatalogCardView(props: AddSubcatalogCardViewProps) {
  const { parentCatalogId, onSubmit } = props;
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="text-lg leading-none">Add subcatalog</CardTitle>
      </CardHeader>
      <CardContent>
        <AddCatalogFormView
          parentCatalogId={parentCatalogId}
          onSubmit={onSubmit}
        />
      </CardContent>
    </Card>
  );
}
