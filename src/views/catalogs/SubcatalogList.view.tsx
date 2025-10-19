import type { CatalogSummary } from "@/domain/types/dataset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface SubcatalogListViewProps {
  children: CatalogSummary[];
  onOpen: (id: string) => void;
}

export function SubcatalogListView(props: SubcatalogListViewProps) {
  const { children, onOpen } = props;
  if (!children || children.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium tracking-tight mb-3">Subcatalogs</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {children.map((c) => (
            <TableRow
              key={c.id}
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => onOpen(c.id)}
            >
              <TableCell className="font-medium">{c.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {c.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
