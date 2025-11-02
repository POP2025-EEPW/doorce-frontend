import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/lib/components/ui/table";
import { Button } from "@/ui/lib/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/lib/components/ui/dropdown-menu";
import { Badge } from "@/ui/lib/components/ui/badge";
import type { DatasetSummary } from "@/domain/dataset/dataset.types";
import { useNavigate } from "react-router-dom";

interface DatasetTableViewProps {
  datasets: DatasetSummary[];
}

export function DatasetTableView(props: DatasetTableViewProps) {
  const { datasets } = props;

  const nav = useNavigate();

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
              onClick={() => nav(`/dataset/${d.id}`)}
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
                        nav(`/dataset/${d.id}/edit`);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation();
                        nav(`/dataset/${d.id}/set-schema`);
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
