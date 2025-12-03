import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/ui/lib/components/ui/dialog";
import { FileDown } from "lucide-react";
import { Button } from "@/ui/lib/components/ui/button.tsx";

export interface DownloadDatasetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  downloadUrl: string;
}

export function DownloadDatasetModalView({
  open,
  onOpenChange,
  downloadUrl,
}: DownloadDatasetModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Dataset</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          {/* Visual representation */}
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <FileDown className="h-8 w-8 text-primary" />
          </div>

          <div className="text-center space-y-1">
            <h4 className="text-sm font-medium">Ready for download</h4>
          </div>

          {/* Main Action */}
          <Button asChild className="w-full sm:w-auto min-w-[200px]">
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
              Download file
            </a>
          </Button>

          {/* Optional: Copy link */}
          <Button
            variant="link"
            size="sm"
            className="text-muted-foreground cursor-pointer"
            onClick={() => navigator.clipboard.writeText(downloadUrl)}
          >
            Copy direct link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
