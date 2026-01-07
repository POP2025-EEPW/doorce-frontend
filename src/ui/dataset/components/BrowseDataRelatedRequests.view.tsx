"use client";
import { Button } from "@/ui/lib/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/lib/components/ui/dialog";
import { Input } from "@/ui/lib/components/ui/input";
import { Label } from "@/ui/lib/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/lib/components/ui/select";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/api/client";
import DatasetUseCase, {
  listDataRelatedRequests,
  type DataRelatedRequestDto,
} from "@/domain/dataset/dataset.uc";
import type { DatasetSummary } from "@/domain/dataset/dataset.types";

interface Props {
  datasetId: string | null;
  onDatasetIdChange: (datasetId: string | null) => void;
  onClose: () => void;
  onOpenSubmit: () => void;
}

const PAGE_SIZE = 20;

export default function BrowseDataRelatedRequestsModal(props: Props) {
  const { datasetId, onDatasetIdChange, onClose, onOpenSubmit } = props;
  const navigate = useNavigate();

  const deps = useRef<{ datasetUseCase: DatasetUseCase } | null>(null);
  deps.current ??= {
    datasetUseCase: new DatasetUseCase(apiClient),
  };

  const { datasetUseCase } = deps.current;

  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);
  const [datasetsLoading, setDatasetsLoading] = useState(false);
  const [datasetsError, setDatasetsError] = useState<string | null>(null);
  const [datasetSearch, setDatasetSearch] = useState("");

  const [requests, setRequests] = useState<DataRelatedRequestDto[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadDatasets() {
      setDatasetsLoading(true);
      setDatasetsError(null);

      try {
        const data = await datasetUseCase.listDatasets(undefined, 0, 200);
        if (!mounted) return;
        setDatasets(data);
      } catch (err: unknown) {
        if (!mounted) return;
        const message =
          err instanceof Error ? err.message : "Failed to load datasets";
        setDatasetsError(message);
      } finally {
        if (mounted) setDatasetsLoading(false);
      }
    }

    loadDatasets();

    return () => {
      mounted = false;
    };
  }, [datasetUseCase]);

  const selectedDataset = useMemo(
    () => datasets.find((d) => d.id === datasetId) ?? null,
    [datasets, datasetId],
  );

  const filteredDatasets = useMemo(() => {
    const q = datasetSearch.trim().toLowerCase();
    if (!q) return datasets;
    return datasets.filter(
      (d) =>
        d.title.toLowerCase().includes(q) || d.id.toLowerCase().includes(q),
    );
  }, [datasets, datasetSearch]);

  const loadRequests = useCallback(
    async (pageNum: number) => {
      setRequestsLoading(true);
      setLocalError(null);

      try {
        if (!datasetId) {
          setLocalError("Please select a dataset first");
          setRequests([]);
          setPage(0);
          return;
        }

        const data = await listDataRelatedRequests(
          datasetId,
          pageNum,
          PAGE_SIZE,
        );
        setRequests(data);
        setPage(pageNum);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load requests";
        setLocalError(message);
      } finally {
        setRequestsLoading(false);
      }
    },
    [datasetId],
  );

  const onGoToDataset = useCallback(() => {
    if (!datasetId) {
      setLocalError("Please select a dataset first");
      return;
    }

    onClose();
    navigate(`/dataset/${datasetId}`);
  }, [datasetId, navigate, onClose]);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Data Related Requests</DialogTitle>
          <DialogDescription>
            Browse existing requests for a dataset.
          </DialogDescription>
        </DialogHeader>

        <div className="pt-3 space-y-2">
          <Label htmlFor="drr-dataset">Dataset</Label>

          <div className="grid grid-cols-1 gap-2">
            <Input
              value={datasetSearch}
              onChange={(e) => setDatasetSearch(e.target.value)}
              placeholder="Search datasets by name or ID"
              className="w-full"
            />
            <Input
              value={datasetId ?? ""}
              onChange={(e) => {
                setLocalError(null);
                onDatasetIdChange(e.target.value || null);
              }}
              placeholder="Or paste dataset ID"
              className="w-full"
            />
          </div>

          <Select
            value={selectedDataset?.id ?? ""}
            onValueChange={(value) => {
              setLocalError(null);
              onDatasetIdChange(value || null);
              setRequests([]);
              setPage(0);
            }}
          >
            <SelectTrigger id="drr-dataset" className="w-full">
              <SelectValue
                placeholder={
                  datasetsLoading ? "Loading datasets..." : "Select a dataset"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {filteredDatasets.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {datasetsError && (
            <div className="text-sm text-red-600">{datasetsError}</div>
          )}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="space-y-0.5">
              <h4 className="text-sm font-medium">Requests</h4>
              <div className="text-xs text-muted-foreground">
                {selectedDataset
                  ? selectedDataset.title
                  : "No dataset selected"}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onGoToDataset}
                disabled={!datasetId}
              >
                Open dataset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLocalError(null);
                  onClose();
                  onOpenSubmit();
                }}
              >
                Submit new
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadRequests(0)}
                disabled={requestsLoading || !datasetId}
              >
                Load
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadRequests(Math.max(0, page - 1))}
                disabled={requestsLoading || page === 0}
              >
                Prev
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadRequests(page + 1)}
                disabled={requestsLoading || requests.length < PAGE_SIZE}
              >
                Next
              </Button>
            </div>
          </div>

          {localError && (
            <div className="text-sm text-red-600 mb-3">{localError}</div>
          )}

          {requestsLoading ? (
            <div className="text-center py-6">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6">
              No requests found
            </div>
          ) : (
            <div className="grid gap-3 max-h-64 overflow-auto pr-2">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="p-4 border rounded-lg bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{r.subject}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.status}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mt-1">
                    {r.requesterUsername} • Dataset:{" "}
                    {selectedDataset?.title ?? ""}
                  </div>

                  <div className="mt-2 text-sm leading-relaxed">
                    {r.description}
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
