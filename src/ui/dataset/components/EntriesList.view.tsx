// EntriesList.view.tsx

import { useState } from "react";
import type { DatasetEntry } from "@/domain/dataset/dataset.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/lib/components/ui/card";
import { Badge } from "@/ui/lib/components/ui/badge";
import { Button } from "@/ui/lib/components/ui/button";
import { Input } from "@/ui/lib/components/ui/input";

interface EntriesListViewProps {
  entries: DatasetEntry[];
  onAddEntry: (content: string) => void;
  onSetErroneous: (entryId: string) => void;
  onSetSuspicious: (entryId: string) => void;
  isAddingEntry?: boolean;
  onBack?: () => void;
}

export function EntriesListView({
  entries,
  onAddEntry,
  onSetErroneous,
  onSetSuspicious,
  isAddingEntry = false,
  onBack,
}: EntriesListViewProps) {
  const [content, setContent] = useState("");

  const handleAddEntry = () => {
    if (content.trim()) {
      onAddEntry(content.trim());
      setContent("");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          &larr; Back to dataset
        </Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddEntry()}
            />
            <Button
              onClick={handleAddEntry}
              disabled={isAddingEntry || !content.trim()}
            >
              {isAddingEntry ? "Adding..." : "Add Entry"}
            </Button>
          </div>
        </CardContent>
      </Card>

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
                        onClick={() => onSetErroneous(entry.id)}
                        disabled={entry.erroneous}
                      >
                        {entry.erroneous ? "Erroneous" : "Mark Erroneous"}
                      </Button>
                      <Button
                        variant={entry.suspicious ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => onSetSuspicious(entry.id)}
                        disabled={entry.suspicious}
                      >
                        {entry.suspicious ? "Suspicious" : "Mark Suspicious"}
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
