import type {
  DatasetSummary,
  DatasetFilter,
  DatasetTab,
} from "@/domain/dataset/dataset.types";
import { DatasetListView } from "../components/DatasetList.view";
import { DatasetFilterView } from "../components/DatasetFilter.view";
import { Tabs, TabsList, TabsTrigger } from "@/ui/lib/components/ui/tabs.tsx";

const tabLabels: Record<DatasetTab, string> = {
  all: "All",
  owned: "Owned",
  qualityControllable: "Quality Controllable",
};

export interface DatasetsPageViewProps {
  datasets: DatasetSummary[];
  filters: DatasetFilter;
  tabs: DatasetTab[];
  activeTab: DatasetTab | undefined;
  onFilterChange: (filter: keyof DatasetFilter, newValue: string) => void;
  onTabChange: (selectedTab: DatasetTab) => void;
  resetFilters: () => void;
  onDatasetSelected?: (datasetId: DatasetSummary["id"]) => void;
  onShowAlerts?: (datasetId: DatasetSummary["id"]) => void;
  canDisplayAlerts?: boolean;
  canDownload?: boolean;
  canAddRawLink?: boolean;
}

export function DatasetsPageView(props: DatasetsPageViewProps) {
  const {
    datasets,
    filters,
    tabs,
    activeTab,
    onFilterChange,
    onTabChange,
    resetFilters,
    onDatasetSelected,
    onShowAlerts,
    canDisplayAlerts,
    canDownload,
    canAddRawLink,
  } = props;
  return (
    <div className="space-y-6 w-full p-5">
      <h1 className="text-2xl font-semibold tracking-tight">Datasets</h1>
      <Tabs
        value={activeTab}
        onValueChange={(val) => onTabChange(val as DatasetTab)}
        className="w-[400px]"
      >
        <TabsList
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
          }}
        >
          {tabs.map((tab: DatasetTab, tabIndex: number) => (
            <TabsTrigger value={tab} key={tabIndex}>
              {tabLabels[tab]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <DatasetFilterView
        filters={filters}
        onFilterChange={onFilterChange}
        resetFilters={resetFilters}
      />
      <DatasetListView
        datasets={datasets}
        onDatasetSelected={onDatasetSelected}
        onShowAlerts={onShowAlerts}
        canDisplayAlerts={canDisplayAlerts}
        canDownload={canDownload}
        canAddRawLink={canAddRawLink}
      />
    </div>
  );
}
