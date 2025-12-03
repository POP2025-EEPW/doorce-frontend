import { useDatasetListController } from "@/application/dataset/datasetList.controller.ts";
import { DatasetsPageView } from "@/ui/dataset/pages/DatasetsPage.view.tsx";
import { Skeleton } from "@/ui/lib/components/ui/skeleton.tsx";
import { Card, CardContent, CardHeader } from "@/ui/lib/components/ui/card.tsx";

export function DatasetsPage() {
  const { datasets, filters, isDatasetsLoading, onFilterChange, resetFilters } =
    useDatasetListController();

  if (isDatasetsLoading) {
    return (
      <main className="flex-1">
        <div className="container mx-auto py-6 space-y-6">
          <h1 className="text-2xl font-semibold tracking-tight">Datasets</h1>
          <div className="space-y-3">
            {/* Render 3-5 skeleton items to mimic a list */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      {/* Title Skeleton: h-5 matches text-lg visual weight */}
                      <Skeleton className="h-5 w-[140px]" />

                      {/* Menu Button Skeleton: Exact match for h-8 w-8 */}
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Description Skeleton: h-4 matches text-sm */}
                    <Skeleton className="h-4 w-full max-w-[300px] mt-1" />
                  </CardContent>
                </Card>

                {/* Include the separator logic if you want exact 1:1 fidelity */}
                {i < 2 && <div className="h-[1px] bg-border my-3" />}
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <DatasetsPageView
      datasets={datasets}
      filters={filters}
      onFilterChange={onFilterChange}
      resetFilters={resetFilters}
    />
  );
}
