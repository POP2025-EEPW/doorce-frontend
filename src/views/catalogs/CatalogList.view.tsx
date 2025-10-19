import type { CatalogSummary } from "@/domain/types/dataset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function CatalogListView({
  catalogs,
  onOpen,
}: {
  catalogs: CatalogSummary[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {catalogs.map((c, idx) => (
        <div key={c.id}>
          <Card
            className="hover:bg-accent cursor-pointer"
            onClick={() => onOpen(c.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {c.description && (
                <div className="text-sm text-muted-foreground">
                  {c.description}
                </div>
              )}
            </CardContent>
          </Card>
          {idx < catalogs.length - 1 && <Separator />}
        </div>
      ))}
      {catalogs.length === 0 && (
        <div className="text-sm text-muted-foreground">No catalogs</div>
      )}
    </div>
  );
}
