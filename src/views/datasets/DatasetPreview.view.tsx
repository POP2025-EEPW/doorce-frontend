import type { DatasetPreview } from "@/domain/types/dataset";
import { X } from "lucide-react";

export interface DatasetPreviewViewProps {
  preview?: DatasetPreview | null;
  datasetTitle?: string;
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
        <div className="overflow-x-auto border rounded-lg bg-gray-50">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 font-semibold">
              <tr>
                {preview.columns.map((col) => (
                  <th key={col} className="px-4 py-2 border-b">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.rows.slice(0, 5).map((row, rowIndex) => (
                <tr key={rowIndex} className="odd:bg-white even:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-2 border-b">
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-2 px-2">
            Showing up to 5 rows of preview data
          </p>
        </div>
      ) : (
        <div className="p-4 border border-dashed rounded-lg bg-gray-50 text-center text-gray-500">
          Preview not available for this dataset.
        </div>
      )}
    </div>
  );
}
