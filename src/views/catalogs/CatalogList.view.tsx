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
    <div className="space-y-3">
      {catalogs.map((c, idx) => (
        <div key={c.id}>
          <Card
            className="cursor-pointer transition-colors hover:bg-accent/50"
            onClick={() => onOpen(c.id)}
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
