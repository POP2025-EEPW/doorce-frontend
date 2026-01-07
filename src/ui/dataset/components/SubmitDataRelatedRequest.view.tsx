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
import { Textarea } from "@/ui/lib/components/ui/textarea";
import { apiClient } from "@/api/client";
import DatasetUseCase, {
  submitDataRelatedRequest,
  type DataRelatedRequestPayload,
} from "@/domain/dataset/dataset.uc";
import type { DatasetSummary } from "@/domain/dataset/dataset.types";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  datasetId: string | null;
  onDatasetIdChange: (datasetId: string | null) => void;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function SubmitDataRelatedRequestModal(props: Props) {
  const { datasetId, onDatasetIdChange, onClose, onSubmitted } = props;

  const deps = useRef<{ datasetUseCase: DatasetUseCase } | null>(null);
  deps.current ??= {
    datasetUseCase: new DatasetUseCase(apiClient),
  };

  const { datasetUseCase } = deps.current;

  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);
  const [datasetsLoading, setDatasetsLoading] = useState(false);
  const [datasetsError, setDatasetsError] = useState<string | null>(null);
  const [datasetSearch, setDatasetSearch] = useState("");

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setLocalError(null);

    if (!datasetId) {
      setLocalError("Please select a dataset");
      return;
    }
    if (!subject || !description) {
      setLocalError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const payload: DataRelatedRequestPayload = { subject, description };
      await submitDataRelatedRequest(datasetId, payload);
      toast.success("Request submitted");
      setSubject("");
      setDescription("");
      onSubmitted();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit request";
      setLocalError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Data Related Request</DialogTitle>
          <DialogDescription>
            Select a dataset and submit a new request.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 pt-3">
          <div className="space-y-2">
            <Label htmlFor="drr-dataset">Dataset</Label>

            <div className="grid grid-cols-1 gap-2">
              <Input
                value={datasetSearch}
                onChange={(e) => setDatasetSearch(e.target.value)}
                placeholder="Search datasets by name or ID"
                className="w-full"
                disabled={datasetsLoading}
              />
              <Input
                value={datasetId ?? ""}
                onChange={(e) => {
                  setLocalError(null);
                  onDatasetIdChange(e.target.value || null);
                }}
                placeholder="Or paste dataset ID"
                className="w-full"
                disabled={loading}
              />
            </div>

            <Select
              value={selectedDataset?.id ?? ""}
              onValueChange={(value) => {
                setLocalError(null);
                onDatasetIdChange(value || null);
              }}
              disabled={datasetsLoading}
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
            {selectedDataset && (
              <div className="text-xs text-muted-foreground">
                Selected: {selectedDataset.title}
              </div>
            )}
            {datasetsError && (
              <div className="text-sm text-red-600">{datasetsError}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="drr-subject">Subject</Label>
            <Input
              id="drr-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Short subject"
              className="w-full"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="drr-description">Description</Label>
            <Textarea
              id="drr-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details of the request..."
              className="w-full min-h-[100px]"
              disabled={loading}
            />
          </div>

          {localError && (
            <div className="text-sm text-red-600">{localError}</div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
