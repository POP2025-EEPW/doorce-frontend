import type { CatalogSummary } from "@/domain/catalog/catalog.type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/lib/components/ui/card";
import { Separator } from "@/ui/lib/components/ui/separator";

interface CatalogListViewProps {
  catalogs: CatalogSummary[];
  setSelectedCatalogId: (catalogId: string) => void;
}

export function CatalogListView(props: CatalogListViewProps) {
  const { catalogs, setSelectedCatalogId } = props;
  console.log("catalogs", catalogs);

  return (
    <div className="space-y-3">
      {catalogs.map((c, idx) => (
        <div key={c.id}>
          <Card
            className="cursor-pointer transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            tabIndex={0}
            onClick={() => {
              setSelectedCatalogId(c.id);
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg leading-none">{c.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {c.description && (
                <div className="text-sm text-muted-foreground">
                  {c.description}
                </div>
              )}
            </CardContent>
          </Card>
          {idx < catalogs.length - 1 && <Separator className="my-3" />}
        </div>
      ))}
      {catalogs.length === 0 && (
        <div className="text-sm text-muted-foreground">No catalogs</div>
      )}
    </div>
  );
}
