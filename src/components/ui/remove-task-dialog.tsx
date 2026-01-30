import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RemoveTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function RemoveTaskDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
}: RemoveTaskDialogProps): React.ReactNode {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        data-slot="remove-task-dialog"
        className="sm:max-w-[400px]"
      >
        <DialogHeader>
          <DialogTitle>Remove Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this task? This action cannot be
            undone and all tracked time will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { RemoveTaskDialog };
export type { RemoveTaskDialogProps };
