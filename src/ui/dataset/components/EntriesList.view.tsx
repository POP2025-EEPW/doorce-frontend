// EntriesList.view.tsx

import type { DatasetEntry } from "@/domain/dataset/dataset.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/lib/components/ui/card";
import { Badge } from "@/ui/lib/components/ui/badge";
import { Button } from "@/ui/lib/components/ui/button";

interface EntriesListViewProps {
  entries: DatasetEntry[];
  onSetErroneous: (entryId: string, erroneous: boolean) => void;
  onSetSuspicious: (entryId: string, suspicious: boolean) => void;
  onBack?: () => void;
}

export function EntriesListView({
  entries,
  onSetErroneous,
  onSetSuspicious,
  onBack,
}: EntriesListViewProps) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          &larr; Back to dataset
        </Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Dataset Entries ({entries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-muted-foreground italic">No entries found.</p>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-md border border-border bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm flex-1">{entry.content}</p>
                    <div className="flex gap-2 flex-shrink-0">
                      {entry.erroneous && (
                        <Badge variant="destructive">Erroneous</Badge>
                      )}
                      {entry.suspicious && (
                        <Badge variant="secondary">Suspicious</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(entry.created_at).toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant={entry.erroneous ? "destructive" : "outline"}
                        size="sm"
                        onClick={() =>
                          onSetErroneous(entry.id, !entry.erroneous)
                        }
                      >
                        {entry.erroneous ? "Unset Erroneous" : "Set Erroneous"}
                      </Button>
                      <Button
                        variant={entry.suspicious ? "secondary" : "outline"}
                        size="sm"
                        onClick={() =>
                          onSetSuspicious(entry.id, !entry.suspicious)
                        }
                      >
                        {entry.suspicious
                          ? "Unset Suspicious"
                          : "Set Suspicious"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
