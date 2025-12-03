import type {
  DatasetSummary,
  DatasetFilter,
} from "@/domain/dataset/dataset.types";
import { DatasetListView } from "../components/DatasetList.view";
import { DatasetFilterView } from "../components/DatasetFilter.view";

export interface DatasetsPageViewProps {
  datasets: DatasetSummary[];
  filters: DatasetFilter;
  onFilterChange: (filter: keyof DatasetFilter, newValue: string) => void;
  resetFilters: () => void;
  onDatasetSelected?: (datasetId: DatasetSummary["id"]) => void;
}

export function DatasetsPageView(props: DatasetsPageViewProps) {
  const { datasets, filters, onFilterChange, resetFilters, onDatasetSelected } =
    props;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Datasets</h1>
      <DatasetFilterView
        filters={filters}
        onFilterChange={onFilterChange}
        resetFilters={resetFilters}
      />
      <DatasetListView
        datasets={datasets}
        onDatasetSelected={onDatasetSelected}
      />
    </div>
  );
}
