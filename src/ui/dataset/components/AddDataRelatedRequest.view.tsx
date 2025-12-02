"use client";
import { Button } from "@/ui/lib/components/ui/button";
import { Input } from "@/ui/lib/components/ui/input";
import { Textarea } from "@/ui/lib/components/ui/textarea";
import { Dialog } from "@/ui/lib/components/ui/dialog";
import { toast } from "sonner";
import { useDataRelatedRequests } from "@/application/dataset/dataset.presenter";
import { useState } from "react";

interface Props {
  onClose: () => void;
}

export default function AddDataRelatedRequestModal({ onClose }: Props) {
  const {
    datasetId,
    setDatasetId,
    requests,
    loading,
    loadingList,
    error,
    page,
    pageSize,
    load,
    submit,
  } = useDataRelatedRequests();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

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
    try {
      await submit({ subject, description });
      toast.success("Request submitted");
      setSubject("");
      setDescription("");
    } catch (err: any) {
      setLocalError(err?.message ?? "Failed to submit request");
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <div className="p-6 max-w-3xl w-full mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Data Related Requests</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Submit a new request or view existing ones for a dataset.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Dataset ID</label>
            <Input
              value={datasetId ?? ""}
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
          {(localError ?? error) && (
            <div className="text-sm text-red-600">{localError ?? error}</div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
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
                onClick={() => load(0)}
                disabled={loadingList}
              >
                Load
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => load(Math.max(0, page - 1))}
                disabled={loadingList || page === 0}
              >
                Prev
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => load(page + 1)}
                disabled={loadingList || requests.length < pageSize}
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
              {requests.map((r: any) => (
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
      </div>
    </Dialog>
  );
}
