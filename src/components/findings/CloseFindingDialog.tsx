import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CloseFindingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  findingId: string;
  onConfirm?: (closureNotes: string) => void;
}

export function CloseFindingDialog({
  open,
  onOpenChange,
  findingId,
  onConfirm,
}: CloseFindingDialogProps) {
  const [closureNotes, setClosureNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!closureNotes.trim()) {
      toast.error("Please provide closure notes");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (onConfirm) {
        onConfirm(closureNotes);
      }

      toast.success(`Finding ${findingId} closed successfully`);
      setClosureNotes("");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to close finding");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close Finding</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to close finding {findingId}? This action will mark the finding as resolved and complete.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="closure-notes">Closure Notes (Required)</Label>
          <Textarea
            id="closure-notes"
            placeholder="Describe the resolution and any final notes..."
            value={closureNotes}
            onChange={(e) => setClosureNotes(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting || !closureNotes.trim()}>
            {isSubmitting ? "Closing..." : "Close Finding"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
