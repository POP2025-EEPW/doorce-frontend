import { MoreHorizontal, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { DatasetSummary } from "@/domain/dataset/dataset.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/lib/components/ui/card";
import { Button } from "@/ui/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/lib/components/ui/dropdown-menu";
import { Separator } from "@/ui/lib/components/ui/separator";

import { EditDatasetModalView } from "./EditDatasetForm.view";
import { useEditDatasetController } from "@/application/dataset/editDataset.controller";
import { useEditDatasetPresenter } from "@/application/dataset/editDatasetPresenter.ts";

interface DatasetListViewProps {
  datasets: DatasetSummary[];
  onDatasetUpdated?: () => void;
}

export function DatasetListView(props: DatasetListViewProps) {
  const { datasets, onDatasetUpdated } = props;

  const nav = useNavigate();

  const safeDatasets = Array.isArray(datasets) ? datasets : [];

  // Controller - manages state and business logic
  const editController = useEditDatasetController({
    onDatasetUpdated: () => {
      onDatasetUpdated?.();
    },
  });

  // Presenter - transforms controller data for View
  const { viewProps: editModalViewProps } = useEditDatasetPresenter({
    dataset: editController.selectedDataset,
    isOpen: editController.isModalOpen,
    isPending: editController.isPending,
    isLoadingDataset: editController.isLoadingDataset,
    schemaName: editController.schemaName,
    onClose: editController.closeEditModal,
    onSubmit: editController.submitEdit,
  });

  return (
    <>
      <div className="space-y-3">
        {safeDatasets.map((dataset, idx) => (
          <div key={dataset.id}>
            <Card
              className="cursor-pointer transition-colors hover:bg-accent/50"
              onClick={() => nav(`/dataset/${dataset.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-none">
                    {dataset.title}
                  </CardTitle>

                  {/* Dropdown menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 -mt-1 -mr-2"
                        onClick={(e) => e.stopPropagation()} // Prevent card click
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          editController.openEditModal(dataset);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit dataset
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {dataset.description && (
                  <div className="text-sm text-muted-foreground">
                    {dataset.description}
                  </div>
                )}
              </CardContent>
            </Card>
            {idx < safeDatasets.length - 1 && <Separator className="my-3" />}
          </div>
        ))}
        {safeDatasets.length === 0 && (
          <div className="text-sm text-muted-foreground">No datasets</div>
        )}
      </div>

      {/* Edit Modal */}
      <EditDatasetModalView {...editModalViewProps} />
    </>
  );
}
