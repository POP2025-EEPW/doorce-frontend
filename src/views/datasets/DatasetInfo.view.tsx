import type { Dataset } from "@/domain/types/dataset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function DatasetInfoView({ dataset }: { dataset: Dataset }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="leading-none">{dataset.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {dataset.description && (
          <p className="text-muted-foreground">{dataset.description}</p>
        )}
        <Separator className="my-3" />
        <div className="text-sm">Status: {dataset.status}</div>
      </CardContent>
    </Card>
  );
}
