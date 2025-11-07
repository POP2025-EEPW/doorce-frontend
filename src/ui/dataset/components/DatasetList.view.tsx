import type { DatasetSummary } from "@/domain/dataset/dataset.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui/lib/components/ui/card";
import { Separator } from "@/ui/lib/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface DatasetListViewProps {
  datasets: DatasetSummary[];
}

export function DatasetListView(props: DatasetListViewProps) {
  const { datasets } = props;

  const nav = useNavigate();

  const safeDatasets = Array.isArray(datasets) ? datasets : [];

  return (
    <div className="space-y-3">
      {safeDatasets.map((c, idx) => (
        <div key={c.id}>
          <Card
            className="cursor-pointer transition-colors hover:bg-accent/50"
            onClick={() => nav(`/dataset/${c.id}`)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg leading-none">{c.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {c.description && (
                <div className="text-sm text-muted-foreground">
                  {c.description}
                </div>
              )}
            </CardContent>
          </Card>
          {idx < safeDatasets.length - 1 && <Separator className="my-3" />}
        </div>
      ))}
      {safeDatasets.length === 0 && (
        <div className="text-sm text-muted-foreground">No datasets</div>
      )}
    </div>
  );
}
