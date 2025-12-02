import { Input } from "@/ui/lib/components/ui/input";
import { Button } from "@/ui/lib/components/ui/button";
import type { DatasetFilter } from "@/domain/dataset/dataset.types";

export interface DatasetFilterViewProps {
  filters: DatasetFilter;
  onFilterChange: (filter: keyof DatasetFilter, newValue: string) => void;
  resetFilters: () => void;
}

export function DatasetFilterView(props: DatasetFilterViewProps) {
  const { filters, onFilterChange, resetFilters } = props;

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Search</label>
        <Input
          placeholder="Search datasets..."
          value={filters.text ?? ""}
          onChange={(e) => onFilterChange("text", e.target.value)}
          className="w-64"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Status</label>
        <select
          value={filters.status ?? ""}
          onChange={(e) =>
            onFilterChange("status", e.target.value ?? undefined)
          }
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
          value={filters.catalogId ?? ""}
          onChange={(e) => onFilterChange("catalogId", e.target.value)}
          className="w-48"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Owner ID</label>
        <Input
          placeholder="Owner ID"
          value={filters.ownerId ?? ""}
          onChange={(e) => onFilterChange("ownerId", e.target.value)}
          className="w-48"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Schema ID</label>
        <Input
          placeholder="Schema ID"
          value={filters.schemaId ?? ""}
          onChange={(e) => onFilterChange("schemaId", e.target.value)}
          className="w-48"
        />
      </div>

      <Button variant="outline" onClick={resetFilters}>
        Reset filters
      </Button>
    </div>
  );
}
