import type { DataSchema } from "@/domain/schema/schema.type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/lib/components/ui/card";
import { Button } from "@/ui/lib/components/ui/button";
import { Separator } from "@/ui/lib/components/ui/separator";
import { Edit2, Layers } from "lucide-react";

interface Props {
  schemas: DataSchema[];
  onEdit: (schema: DataSchema) => void;
}

export function DataSchemaListView({ schemas, onEdit }: Props) {
  return (
    <div className="space-y-3">
      {schemas.map((schema, idx) => (
        <div key={schema.id}>
          <Card className="transition-colors hover:bg-accent/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg leading-none">
                    {schema.name}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Version: {schema.version}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(schema)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {schema.description && (
                <div className="mb-2 text-sm text-muted-foreground">
                  {schema.description}
                </div>
              )}
              <div className="flex items-center text-sm font-medium text-muted-foreground">
                <Layers className="mr-2 h-4 w-4" />
                {schema.concepts.length}{" "}
                {schema.concepts.length === 1 ? "Concept" : "Concepts"}
              </div>
            </CardContent>
          </Card>
          
          {/* Dodajemy Separator, jeśli to nie jest ostatni element */}
          {idx < schemas.length - 1 && <Separator className="my-3" />}
        </div>
      ))}

      {schemas.length === 0 && (
        <div className="text-sm text-muted-foreground py-4 text-center">
          No data schemas found.
        </div>
      )}
    </div>
  );
}