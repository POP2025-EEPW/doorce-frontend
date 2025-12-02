// EntriesListPage.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useEntryController } from "@/application/dataset/entry.controller";
import { EntriesListView } from "../components/EntriesList.view";
import { Skeleton } from "@/ui/lib/components/ui/skeleton";
import { useCallback } from "react";

export default function EntriesListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const datasetId = id ?? null;

  const {
    entries,
    isLoading,
    isAddingEntry,
    onAddEntry,
    onSetErroneous,
    onSetSuspicious,
  } = useEntryController(datasetId);

  const onBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="container mx-auto py-6 space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-64 w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <EntriesListView
        entries={entries}
        onAddEntry={onAddEntry}
        onSetErroneous={onSetErroneous}
        onSetSuspicious={onSetSuspicious}
        isAddingEntry={isAddingEntry}
        onBack={onBack}
      />
    </main>
  );
}
