import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/lib/components/ui/dialog";
import { Button } from "@/ui/lib/components/ui/button";
import { Input } from "@/ui/lib/components/ui/input";
import { Label } from "@/ui/lib/components/ui/label";

interface AddQualityTagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (tag: string) => void;
  isSubmitting?: boolean;
  currentTag?: string;
}

export function AddQualityTagModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  currentTag = "",
}: AddQualityTagModalProps) {
  const [tag, setTag] = useState(currentTag || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTag = tag?.trim() || "";
    if (trimmedTag) {
      onSubmit(trimmedTag);
      onOpenChange(false);
      setTag("");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setTag(currentTag || "");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // Reset tag when opening modal
      setTag(currentTag || "");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Set Quality Tag</DialogTitle>
            <DialogDescription>
              Add or update the quality tag for this dataset.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="quality-tag">Quality Tag</Label>
              <Input
                id="quality-tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Enter quality tag"
                disabled={isSubmitting}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !tag?.trim()}>
              {isSubmitting ? "Saving..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
