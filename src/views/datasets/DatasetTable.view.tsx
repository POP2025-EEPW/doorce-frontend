import type { DatasetSummary } from "@/domain/types/dataset";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function DatasetTableView({
  datasets,
  onOpen,
}: {
  datasets: DatasetSummary[];
  onOpen: (id: string) => void;
}) {
  return (
    <>
      <h2 className="text-lg font-medium tracking-tight mb-3">Datasets</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datasets.map((d) => (
            <TableRow
              key={d.id}
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => onOpen(d.id)}
            >
              <TableCell className="font-medium">{d.title}</TableCell>
              <TableCell>
                <Badge variant="secondary">{d.status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {d.description}
              </TableCell>
            </TableRow>
          ))}
          {datasets.length === 0 && (
            <TableRow>
              <TableCell className="text-sm text-muted-foreground" colSpan={3}>
                No datasets
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
