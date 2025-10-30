import type { DatasetSummary } from "@/domain/types/dataset";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function DatasetTableView({
  datasets,
  onOpen,
  onEdit,
  onSetSchema,
}: {
  datasets: DatasetSummary[];
  onOpen: (id: string) => void;
  onEdit: (dataset: DatasetSummary) => void;
  onSetSchema: (dataset: DatasetSummary) => void;
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
            <TableHead className="w-[50px]"></TableHead>
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
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        e.stopPropagation()
                      }
                    >
                      Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation();
                        onEdit(d);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation();
                        onSetSchema(d);
                      }}
                    >
                      Set Schema
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
