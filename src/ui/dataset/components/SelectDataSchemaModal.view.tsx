import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/lib/components/ui/dialog";
import { Button } from "@/ui/lib/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/ui/lib/components/ui/radio-group";
import { Label } from "@/ui/lib/components/ui/label";
import type { DataSchema } from "@/domain/schema/schema.type";

export interface SelectDataSchemaModalViewProps {
  open: boolean;
  schemas: DataSchema[];
  selectedSchemaId: string | null;
  isLoading?: boolean;
  isSaving?: boolean;
  onSelectSchema: (schemaId: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onOpenChange: (open: boolean) => void;
}

export function SelectDataSchemaModalView({
  open,
  schemas,
  selectedSchemaId,
  isLoading = false,
  isSaving = false,
  onSelectSchema,
  onConfirm,
  onCancel,
  onOpenChange,
}: SelectDataSchemaModalViewProps) {
  const canConfirm = selectedSchemaId !== null && !isSaving;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Data Schema</DialogTitle>
          <DialogDescription>
            Choose a data schema to assign to this dataset
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Loading schemas...</p>
            </div>
          ) : schemas.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No schemas available</p>
            </div>
          ) : (
            <RadioGroup
              value={selectedSchemaId ?? ""}
              onValueChange={onSelectSchema}
            >
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {schemas.map((schema) => (
                  <div
                    key={schema.id}
                    className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent"
                  >
                    <RadioGroupItem value={schema.id} id={schema.id} />
                    <div className="flex-1 space-y-1">
                      <Label
                        htmlFor={schema.id}
                        className="font-medium cursor-pointer"
                      >
                        {schema.name}
                        {schema.version && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            v{schema.version}
                          </span>
                        )}
                      </Label>
                      {schema.description && (
                        <p className="text-sm text-muted-foreground">
                          {schema.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!canConfirm}>
            {isSaving ? "Assigning..." : "Assign Schema"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
