// ui/dataset/components/DatasetList.view.tsx
import { useEffect } from "react";
import {
  MoreHorizontal,
  Pencil,
  FileText,
  AlertCircle,
  Download,
} from "lucide-react";
import { toast } from "sonner";

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
import { SelectDataSchemaModalView } from "./SelectDataSchemaModal.view";
import { useEditDatasetController } from "@/application/dataset/editDataset.controller";
import { useSetDatasetSchemaController } from "@/application/schema/setDataSchema.controller";
import { DownloadDatasetModalView } from "@/ui/dataset/components/DownloadDatasetModal.view.tsx";
import { useDownloadDatasetController } from "@/application/dataset/downloadDataset.controller.ts";

interface DatasetListViewProps {
  datasets: DatasetSummary[];
  onDatasetUpdated?: () => void;
  onDatasetSelected?: (datasetId: DatasetSummary["id"]) => void;
  onShowAlerts?: (datasetId: DatasetSummary["id"]) => void;
  canDisplayAlerts?: boolean;
  canDownload?: boolean;
}

export function DatasetListView(props: DatasetListViewProps) {
  const {
    datasets,
    onDatasetUpdated,
    onDatasetSelected,
    onShowAlerts,
    canDisplayAlerts,
    canDownload,
  } = props;
  const safeDatasets = Array.isArray(datasets) ? datasets : [];

  // Edit controller - now returns viewProps directly
  const {
    viewProps: editModalViewProps,
    notification: editNotification,
    clearNotification: clearEditNotification,
    openEditModal,
  } = useEditDatasetController({
    onDatasetUpdated: () => {
      onDatasetUpdated?.();
    },
  });

  // Handle edit notifications
  useEffect(() => {
    if (editNotification) {
      if (editNotification.type === "success") {
        toast.success(editNotification.message);
      } else {
        toast.error(editNotification.message);
      }
      clearEditNotification();
    }
  }, [editNotification, clearEditNotification]);

  // Set schema controller (assuming similar refactor)
  const {
    viewProps: schemaModalViewProps,
    notification: schemaNotification,
    clearNotification: clearSchemaNotification,
    openSchemaModal,
  } = useSetDatasetSchemaController({
    onSchemaUpdated: () => {
      onDatasetUpdated?.();
    },
  });

  // Handle schema notifications
  useEffect(() => {
    if (schemaNotification) {
      if (schemaNotification.type === "success") {
        toast.success(schemaNotification.message);
      } else {
        toast.error(schemaNotification.message);
      }
      clearSchemaNotification();
    }
  }, [schemaNotification, clearSchemaNotification]);

  const { viewProps: downloadModalViewProps, openDownloadModal } =
    useDownloadDatasetController();

  // Handle schema notifications
  useEffect(() => {
    if (schemaNotification) {
      if (schemaNotification.type === "success") {
        toast.success(schemaNotification.message);
      } else {
        toast.error(schemaNotification.message);
      }
      clearSchemaNotification();
    }
  }, [schemaNotification, clearSchemaNotification]);

  return (
    <>
      <div className="space-y-3">
        {safeDatasets.map((dataset, idx) => (
          <div key={dataset.id}>
            <Card
              className="cursor-pointer transition-colors hover:bg-accent/50"
              onClick={() => onDatasetSelected?.(dataset.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-none">
                    {dataset.title}
                  </CardTitle>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 -mt-1 -mr-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(dataset);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit dataset
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          openSchemaModal(dataset);
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Set schema
                      </DropdownMenuItem>
                      {canDisplayAlerts && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onShowAlerts?.(dataset.id);
                          }}
                        >
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Show alerts
                        </DropdownMenuItem>
                      )}
                      {canDownload && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            openDownloadModal(dataset);
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                      )}
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

      {/* Modals receive viewProps directly from controllers */}
      <EditDatasetModalView {...editModalViewProps} />
      <SelectDataSchemaModalView {...schemaModalViewProps} />
      <DownloadDatasetModalView {...downloadModalViewProps} />
    </>
  );
}
