"use client";
import { Button } from "@/ui/lib/components/ui/button";
import { Input } from "@/ui/lib/components/ui/input";
import { Textarea } from "@/ui/lib/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/lib/components/ui/dialog";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import {
  submitDataRelatedRequest,
  listDataRelatedRequests,
  type DataRelatedRequestPayload,
} from "@/domain/dataset/dataset.uc";

interface DataRelatedRequest {
  id: string;
  subject: string;
  description: string;
  status: string;
  requesterUsername: string;
  createdAt?: string;
}

interface Props {
  onClose: () => void;
}

const PAGE_SIZE = 20;

export default function AddDataRelatedRequestModal({ onClose }: Props) {
  const [datasetId, setDatasetId] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [requests, setRequests] = useState<DataRelatedRequest[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [page, setPage] = useState(0);

  const loadRequests = useCallback(
    async (pageNum: number) => {
      if (!datasetId) {
        setLocalError("Please provide the dataset ID first");
        return;
      }
      setLoadingList(true);
      setLocalError(null);
      try {
        const data = await listDataRelatedRequests(
          datasetId,
          pageNum,
          PAGE_SIZE,
        );
        setRequests(data as DataRelatedRequest[]);
        setPage(pageNum);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load requests";
        setLocalError(message);
      } finally {
        setLoadingList(false);
      }
    },
    [datasetId],
  );

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setLocalError(null);
    if (!datasetId) {
      setLocalError("Please provide the dataset ID");
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
      await loadRequests(0);
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Data Related Requests</DialogTitle>
          <DialogDescription>
            Submit a new request or view existing ones for a dataset.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Dataset ID</label>
            <Input
              value={datasetId}
              onChange={(e) =>
                setDatasetId((e.target as HTMLInputElement).value)
              }
              placeholder="dataset UUID"
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject((e.target as HTMLInputElement).value)}
              placeholder="Short subject"
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) =>
                setDescription((e.target as HTMLTextAreaElement).value)
              }
              placeholder="Details of the request..."
              className="w-full min-h-[100px]"
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

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Requests</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadRequests(0)}
                disabled={loadingList}
              >
                Load
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadRequests(Math.max(0, page - 1))}
                disabled={loadingList || page === 0}
              >
                Prev
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadRequests(page + 1)}
                disabled={loadingList || requests.length < PAGE_SIZE}
              >
                Next
              </Button>
            </div>
          </div>

          {loadingList ? (
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
                    {r.requesterUsername}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
