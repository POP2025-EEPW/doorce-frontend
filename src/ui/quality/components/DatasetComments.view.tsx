import type { DatasetComment } from "@/domain/quality/quality.type";
import { Separator } from "@/ui/lib/components/ui/separator";

export function DatasetComments({ comments }: { comments: DatasetComment[] }) {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Comments</h4>
      <div className="space-y-2">
        {comments && comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c.id}
              className="p-2 rounded-md border border-border bg-muted/30"
            >
              <p className="text-sm">{c.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No comments yet.
          </p>
        )}
      </div>
      <Separator className="my-3" />
    </div>
  );
}
