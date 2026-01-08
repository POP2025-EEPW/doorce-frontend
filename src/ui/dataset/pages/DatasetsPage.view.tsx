"use client";

import type {
  DatasetSummary,
  DatasetFilter,
  DatasetTab,
} from "@/domain/dataset/dataset.types";
import { DatasetListView } from "../components/DatasetList.view";
import { DatasetFilterView } from "../components/DatasetFilter.view";
import { Tabs, TabsList, TabsTrigger } from "@/ui/lib/components/ui/tabs.tsx";
import { Button } from "@/ui/lib/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

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
  onAddClick: () => void;
  canDisplayAlerts?: boolean;
  canDownload?: boolean;
  canAddRawLink?: boolean;
  canCreateDataset?: boolean;
  isCreating?: boolean;
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
    canCreateDataset,
    isCreating,
    onAddClick,
  } = props;

  return (
    <div className="space-y-6 w-full p-5">
      <div className="flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Datasets
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your datasets</p>
        </div>

        {canCreateDataset && (
          <Button
            onClick={onAddClick}
            disabled={isCreating}
            className="flex items-center gap-2"
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {isCreating ? "Creating..." : "Add Dataset"}
          </Button>
        )}
      </div>

      {/* Zakładki (Tabs) */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => onTabChange(val as DatasetTab)}
        className="w-full"
      >
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger value={tab} key={tab} className="px-6">
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
