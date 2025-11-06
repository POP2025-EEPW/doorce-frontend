import type { DatasetSummary } from "@/domain/types/dataset";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import * as DatasetController from "@/controllers/datasets.controller";
import { DatasetPreviewView } from "./DatasetPreview.view";

export function DatasetTableView({
  datasets,
  onOpen,
  onEdit,
  onSetSchema,
}: {
  datasets: DatasetSummary[];
  onOpen: (id: string) => void;
  onEdit: (dataset: DatasetSummary) => void;
  onSetSchema: (dataset: DatasetSummary) => void;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = async (datasetId: string) => {
    try {
      setLoading(true);
      const preview = await DatasetController.getDatasetPreview(datasetId);
      setPreviewData(preview);
      setShowPreview(true);
    } catch (err) {
      console.error("Failed to load preview", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-lg font-medium tracking-tight mb-3">Datasets</h2>

      {showPreview && (
        loading ? (
          <p className="text-sm text-muted-foreground">Loading preview...</p>
        ) : (
          <DatasetPreviewView
            preview={previewData}
            onClose={() => setShowPreview(false)}
          />
        )
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datasets.map((d) => (
            <TableRow
              key={d.id}
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => onOpen(d.id)}
            >
              <TableCell className="font-medium">{d.title}</TableCell>
              <TableCell>
                <Badge variant="secondary">{d.status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {d.description}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        e.stopPropagation()
                      }
                    >
                      Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation();
                        onEdit(d);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation();
                        onSetSchema(d);
                      }}
                    >
                      Set Schema
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async (e: React.MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation();
                        await handlePreview(d.id);
                      }}
                    >
                      Preview
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
