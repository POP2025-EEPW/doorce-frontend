import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/ui/lib/components/ui/dialog";
import { Button } from "@/ui/lib/components/ui/button";
import { Input } from "@/ui/lib/components/ui/input";
import { Label } from "@/ui/lib/components/ui/label";
import { LinkIcon } from "lucide-react";

interface InputLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (url: string) => void;
  isLoading?: boolean;
}

export function UploadRawDatasetModalView({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: InputLinkModalProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    if (!url) return;
    onConfirm(url);
    setUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <LinkIcon className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle>Add Dataset Link</DialogTitle>
          </div>
          <DialogDescription>
            Paste the URL of the raw dataset below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url" className="sr-only">
              URL
            </Label>
            <Input
              id="url"
              placeholder="https://example.com/dataset..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!url || isLoading}
          >
            {isLoading ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
