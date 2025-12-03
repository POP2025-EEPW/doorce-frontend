import type { DatasetPreview } from "@/domain/dataset/dataset.types";
import { X } from "lucide-react";

export interface DatasetPreviewViewProps {
  preview?: DatasetPreview | null;
  onClose: () => void;
}

export function DatasetPreviewView({
  preview,
  onClose,
}: DatasetPreviewViewProps) {
  return (
    <div className="space-y-6 p-6 bg-white rounded-2xl shadow-sm border">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Dataset preview
        </h1>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close preview"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {preview ? (
        <>
          <div>
            <h2 className="text-lg font-medium">{preview.title}</h2>
            <p className="text-sm text-gray-600 mb-2">{preview.description}</p>
            <p className="text-xs text-gray-500">
              Total entries: {preview.entryCount}
            </p>
          </div>

          {preview.sampleEntries.length > 0 ? (
            <div className="overflow-x-auto border rounded-lg bg-gray-50">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 font-semibold">
                  <tr>
                    <th className="px-4 py-2 border-b">ID</th>
                    <th className="px-4 py-2 border-b">Content</th>
                    <th className="px-4 py-2 border-b">Created At</th>
                    <th className="px-4 py-2 border-b">Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.sampleEntries.map((entry) => (
                    <tr key={entry.id} className="odd:bg-white even:bg-gray-50">
                      <td className="px-4 py-2 border-b font-mono text-xs">
                        {entry.id.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-2 border-b">{entry.content}</td>
                      <td className="px-4 py-2 border-b text-gray-500">
                        {new Date(entry.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border-b text-gray-500">
                        {new Date(entry.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 mt-2 px-2 pb-2">
                Showing {preview.sampleEntries.length} sample entries
              </p>
            </div>
          ) : (
            <div className="p-4 border border-dashed rounded-lg bg-gray-50 text-center text-gray-500">
              No sample entries available.
            </div>
          )}
        </>
      ) : (
        <div className="p-4 border border-dashed rounded-lg bg-gray-50 text-center text-gray-500">
          Preview not available for this dataset.
        </div>
      )}
    </div>
  );
}
