import { useState } from "react";
import type {
  CreateDataSchemaDto,
  SchemaConcept,
  SchemaDataType,
  SchemaProperty,
} from "@/domain/schema/schema.type";
import { Button } from "@/ui/lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/lib/components/ui/dialog";
import { Input } from "@/ui/lib/components/ui/input";
import { Label } from "@/ui/lib/components/ui/label";
import { Textarea } from "@/ui/lib/components/ui/textarea";
import { Plus, Trash2, X } from "lucide-react";

interface Props {
  onSubmit: (dto: CreateDataSchemaDto) => void;
  onCancel: () => void;
}

const DATA_TYPES: SchemaDataType[] = [
  "String",
  "Integer",
  "Float",
  "Boolean",
  "Date",
  "DateTime",
];

export default function DataSchemaForm({ onSubmit, onCancel }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // Inicjalizujemy z jednym pustym konceptem, żeby użytkownik widział strukturę
  const [concepts, setConcepts] = useState<Partial<SchemaConcept>[]>([
    { name: "", properties: [] },
  ]);

  // --- Handlers for Concepts ---
  const addConcept = () => {
    setConcepts([...concepts, { name: "", properties: [] }]);
  };

  const removeConcept = (index: number) => {
    const newConcepts = [...concepts];
    newConcepts.splice(index, 1);
    setConcepts(newConcepts);
  };

  const updateConceptName = (index: number, val: string) => {
    const newConcepts = [...concepts];
    newConcepts[index].name = val;
    setConcepts(newConcepts);
  };

  // --- Handlers for Properties ---
  const addProperty = (conceptIndex: number) => {
    const newConcepts = [...concepts];
    const currentProps = newConcepts[conceptIndex].properties || [];
    
    newConcepts[conceptIndex].properties = [
      ...currentProps,
      { name: "", type: "String", isMandatory: false } as SchemaProperty
    ];
    setConcepts(newConcepts);
  };

  const removeProperty = (conceptIndex: number, propIndex: number) => {
    const newConcepts = [...concepts];
    newConcepts[conceptIndex].properties?.splice(propIndex, 1);
    setConcepts(newConcepts);
  };

  const updateProperty = (
    conceptIndex: number, 
    propIndex: number, 
    field: keyof SchemaProperty, 
    value: any
  ) => {
    const newConcepts = [...concepts];
    const props = newConcepts[conceptIndex].properties;
    if (props && props[propIndex]) {
      (props[propIndex] as any)[field] = value;
    }
    setConcepts(newConcepts);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    // Filtrujemy puste wpisy przed wysłaniem
    const validConcepts = concepts
      .filter(c => c.name?.trim())
      .map(c => ({
        name: c.name!,
        description: c.description,
        properties: c.properties?.filter(p => p.name.trim()).map(p => ({
          name: p.name,
          type: p.type,
          isMandatory: p.isMandatory,
          unit: p.unit
        })) || []
      }));

    if (validConcepts.length === 0) return;

    onSubmit({
      name: name.trim(),
      description,
      concepts: validConcepts
    });
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Create Data Schema</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Schema Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Weather Sensor Data"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                rows={2}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Concepts</h3>
              <Button type="button" variant="outline" size="sm" onClick={addConcept}>
                <Plus className="mr-2 h-4 w-4" /> Add Concept
              </Button>
            </div>

            {/* Concepts List */}
            <div className="space-y-4">
              {concepts.map((concept, cIndex) => (
                <div key={cIndex} className="p-4 border rounded-lg bg-muted/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground uppercase mb-1 block">Concept Name</Label>
                      <Input
                        value={concept.name}
                        onChange={(e) => updateConceptName(cIndex, e.target.value)}
                        placeholder="e.g. Engine"
                        className="bg-background"
                      />
                    </div>
                    <div className="mt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => removeConcept(cIndex)}
                        disabled={concepts.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="pl-4 border-l-2 ml-1 space-y-2">
                    {concept.properties?.map((prop, pIndex) => (
                      <div key={pIndex} className="flex gap-2 items-center">
                        <Input
                          value={prop.name}
                          onChange={(e) => updateProperty(cIndex, pIndex, 'name', e.target.value)}
                          placeholder="Property name"
                          className="h-8 flex-[2] text-sm"
                        />
                        <select
                          className="h-8 flex-1 rounded-md border border-input bg-background px-2 py-1 text-xs"
                          value={prop.type}
                          onChange={(e) => updateProperty(cIndex, pIndex, 'type', e.target.value)}
                        >
                          {DATA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <Label className="flex items-center space-x-2 text-sm cursor-pointer px-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 accent-primary"
                            checked={prop.isMandatory}
                            onChange={(e) => updateProperty(cIndex, pIndex, 'isMandatory', e.target.checked)}
                          />
                          <span className="text-xs">Req.</span>
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeProperty(cIndex, pIndex)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs mt-1"
                      onClick={() => addProperty(cIndex)}
                    >
                      <Plus className="mr-1 h-3 w-3" /> Add Property
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2 bg-muted/10">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={!name.trim()}>
            Save Schema
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}