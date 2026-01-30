import * as React from "react";
import { MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RemoveTaskDialog } from "@/components/ui/remove-task-dialog";
import type { TaskId } from "@/types/task";

interface TaskCardMenuProps {
  taskId: TaskId;
  isDisabled?: boolean;
  onRemove?: (taskId: TaskId) => void;
}

function TaskCardMenu({
  taskId,
  isDisabled = false,
  onRemove,
}: TaskCardMenuProps): React.ReactNode {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleTriggerClick = (event: React.MouseEvent): void => {
    event.stopPropagation();
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent): void => {
    event.stopPropagation();
  };

  const handleRemoveClick = (): void => {
    setIsDialogOpen(true);
  };

  const handleConfirmRemove = (): void => {
    onRemove?.(taskId);
    setIsDialogOpen(false);
  };

  const handleCancelRemove = (): void => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 -mr-2 -mt-1"
            onClick={handleTriggerClick}
            onKeyDown={handleTriggerKeyDown}
            disabled={isDisabled}
            aria-label="Task options"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" onClick={handleRemoveClick}>
            <Trash2 />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RemoveTaskDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />
    </>
  );
}

export { TaskCardMenu };
export type { TaskCardMenuProps };
