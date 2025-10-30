import { useState } from "react";
import type { DatasetFilter } from "@/domain/types/dataset";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface DatasetFilterViewProps {
  initialFilter?: DatasetFilter;
  onFilterChange: (filter: DatasetFilter) => void;
}

export function DatasetFilterView({
  initialFilter,
  onFilterChange,
}: DatasetFilterViewProps) {
  const [filter, setFilter] = useState<DatasetFilter>(initialFilter ?? {});

  const handleChange = (
    key: keyof DatasetFilter,
    value: string | undefined,
  ) => {
    const updated = { ...filter, [key]: value ?? undefined };
    setFilter(updated);
    onFilterChange(updated);
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Search</label>
        <Input
          placeholder="Search datasets..."
          value={filter.text ?? ""}
          onChange={(e) => handleChange("text", e.target.value)}
          className="w-64"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Status</label>
        <select
          value={filter.status ?? ""}
          onChange={(e) => handleChange("status", e.target.value ?? undefined)}
          className="border rounded-md px-2 py-1 text-sm"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Catalog ID</label>
        <Input
          placeholder="Catalog ID"
          value={filter.catalogId ?? ""}
          onChange={(e) => handleChange("catalogId", e.target.value)}
          className="w-48"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Owner ID</label>
        <Input
          placeholder="Owner ID"
          value={filter.ownerId ?? ""}
          onChange={(e) => handleChange("ownerId", e.target.value)}
          className="w-48"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Schema ID</label>
        <Input
          placeholder="Schema ID"
          value={filter.schemaId ?? ""}
          onChange={(e) => handleChange("schemaId", e.target.value)}
          className="w-48"
        />
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setFilter({});
          onFilterChange({});
        }}
      >
        Reset filters
      </Button>
    </div>
  );
}
