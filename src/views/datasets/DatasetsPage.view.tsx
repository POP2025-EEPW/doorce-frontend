import { useState } from "react";
import type { Dataset, DatasetFilter } from "@/domain/types/dataset";
import { DatasetListView } from "@/views/datasets/DatasetList.view";
import { DatasetFilterView } from "@/views/datasets/DatasetFilter.view";

export interface DatasetsPageViewProps {
  datasets: Dataset[];
  onOpenDataset: (id: string) => void;
}

export function DatasetsPageView({
  datasets,
  onOpenDataset,
}: DatasetsPageViewProps) {
  const [filter, setFilter] = useState<DatasetFilter>({});

  const handleFilterChange = (newFilter: DatasetFilter) => {
    console.log("Aktualny filtr:", newFilter);
    setFilter(newFilter);
  };

  const filteredDatasets = datasets.filter((d) => {
    if (
      filter.text &&
      !d.title.toLowerCase().includes(filter.text.toLowerCase())
    ) {
      return false;
    }
    if (filter.status && d.status !== filter.status) {
      return false;
    }
    if (filter.catalogId && d.catalogId !== filter.catalogId) {
      return false;
    }
    if (filter.ownerId && d.ownerId !== filter.ownerId) {
      return false;
    }
    if (filter.schemaId && d.schemaId !== filter.schemaId) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Datasets</h1>
      <DatasetFilterView
        initialFilter={filter}
        onFilterChange={handleFilterChange}
      />
      <DatasetListView datasets={filteredDatasets} onOpen={onOpenDataset} />
    </div>
  );
}
