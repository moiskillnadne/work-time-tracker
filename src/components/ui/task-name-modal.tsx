import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TaskNameModalPayload {
  taskName: string;
}

interface TaskNameModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onConfirm: (payload: TaskNameModalPayload) => void;
  defaultValue?: string;
  title?: string;
  description?: string;
}

function TaskNameModal({
  isOpen,
  onOpenChange,
  onCancel,
  onConfirm,
  defaultValue = "",
  title = "Task Name",
  description,
}: TaskNameModalProps): React.ReactNode {
  const [taskName, setTaskName] = React.useState(defaultValue)

  const trimmedTaskName = taskName.trim()
  const isSubmitDisabled = trimmedTaskName.length === 0

  React.useEffect(() => {
    if (isOpen) {
      setTaskName(defaultValue)
    }
  }, [isOpen, defaultValue])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    if (isSubmitDisabled) return
    onConfirm({ taskName: trimmedTaskName })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTaskName(event.target.value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        data-slot="task-name-modal"
        className="sm:max-w-[425px]"
        showCloseButton={false}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <Label htmlFor="task-name">Name of task</Label>
            <Input
              id="task-name"
              name="taskName"
              value={taskName}
              onChange={handleInputChange}
              placeholder="Enter task name"
              autoFocus
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="outline" disabled={isSubmitDisabled}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { TaskNameModal }
export type { TaskNameModalPayload, TaskNameModalProps }
