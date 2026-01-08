"use client";

import { useDatasetListController } from "@/application/dataset/datasetList.controller.ts";
import { DatasetsPageView } from "@/ui/dataset/pages/DatasetsPage.view.tsx";
import { Skeleton } from "@/ui/lib/components/ui/skeleton.tsx";
import { Card, CardContent, CardHeader } from "@/ui/lib/components/ui/card.tsx";
import { Button } from "@/ui/lib/components/ui/button";
import { Plus } from "lucide-react";
import { AddDatasetModalView } from "../components/AddDatasetForm.view";
import { useSchemaController } from "@/application/schema/schema.controller";

export function DatasetsPage() {
  const {
    datasets,
    filters,
    tabs,
    activeTab,
    isDatasetsLoading,
    isCreating,
    onFilterChange,
    onTabChange,
    resetFilters,
    onDatasetSelected,
    onShowAlerts,
    onAddDataset,
    permissions,
    isAddModalOpen,
    onOpenAddModal,
    onCloseAddModal,
  } = useDatasetListController();
  const { schemas } = useSchemaController();

  if (isDatasetsLoading) {
    return (
      <main className="flex-1 w-full">
        <div className="container mx-auto py-6 space-y-6 px-5">
          <div className="mb-4 flex w-full items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Datasets
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage your datasets</p>
            </div>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Add dataset
            </Button>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((key) => (
              <Card key={key}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-5 w-[200px]" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Skeleton className="h-4 w-full max-w-[400px] mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <DatasetsPageView
        datasets={datasets}
        filters={filters}
        tabs={tabs}
        activeTab={activeTab}
        onFilterChange={onFilterChange}
        onTabChange={onTabChange}
        resetFilters={resetFilters}
        onDatasetSelected={onDatasetSelected}
        onShowAlerts={onShowAlerts}
        canDisplayAlerts={permissions.canDisplayAlerts}
        canDownload={permissions.canDownload}
        canAddRawLink={permissions.canAddRawLink}
        canCreateDataset={permissions.canCreateDataset}
        isCreating={isCreating}
        onAddClick={onOpenAddModal}
      />

      <AddDatasetModalView
        isOpen={isAddModalOpen}
        isPending={isCreating}
        onClose={onCloseAddModal}
        onSubmit={onAddDataset}
        schemas={schemas}
      />
    </>
  );
}
