import type { Dataset, DatasetDescription } from "@/domain/types/dataset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function DatasetInfoView({
  dataset,
  description,
}: {
  dataset: Dataset;
  description?: DatasetDescription;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="leading-none">{dataset.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm">Status: {dataset.status}</div>
        <Separator className="my-3" />

        {dataset.description && (
          <p className="text-muted-foreground">{dataset.description}</p>
        )}
        <Separator className="my-3" />

        {description && (
          <>
            <Separator className="my-3" />
            <div className="text-sm text-foreground">
              <strong>Detailed description:</strong>
              {description.description ? (
                <p className="mt-1 text-muted-foreground whitespace-pre-line">
                  {description.description}
                </p>
              ) : (
                <p className="mt-1 text-muted-foreground italic">
                  No additional description.
                </p>
              )}

              {description.fields && description.fields.length > 0 && (
                <>
                  <Separator className="my-3" />
                  <div className="text-sm">
                    <strong>Fields:</strong>
                    <ul className="mt-1 ml-4 list-disc text-muted-foreground">
                      {description.fields.map((field) => (
                        <li key={field.name}>
                          {field.name} ({field.type})
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
