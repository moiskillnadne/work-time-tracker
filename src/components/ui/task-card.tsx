import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { TaskCardMenu } from "@/components/ui/task-card-menu"
import type { TaskId } from "@/types/task"

const taskCardVariants = cva(
  "flex flex-col gap-1 p-4 rounded-lg bg-card border cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      selected: {
        true: "ring-2 ring-primary ring-offset-2 ring-offset-background",
        false: "hover:bg-accent/50",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
)

interface TaskCardProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof taskCardVariants> {
  /** Task ID needed for delete action */
  taskId: TaskId
  /** Task title (max 120 characters, truncated with ellipsis) */
  title: string
  /** Time spent on task in "hh:mm:ss" format */
  spentTime: string
  /** Whether the card is selected */
  isSelected?: boolean
  /** Whether the menu actions should be disabled (timer running on this task) */
  isMenuDisabled?: boolean
  /** Callback when remove action is confirmed */
  onRemove?: (taskId: TaskId) => void
}

function TaskCard({
  className,
  taskId,
  title,
  spentTime,
  isSelected = false,
  isMenuDisabled = false,
  onRemove,
  onClick,
  ...props
}: TaskCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.key === "Enter" || event.key === " ") && onClick) {
      event.preventDefault()
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>)
    }
  }

  return (
    <div
      data-slot="task-card"
      data-selected={isSelected}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      className={cn(taskCardVariants({ selected: isSelected, className }))}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className="text-sm font-medium text-foreground truncate flex-1 min-w-0"
          title={title}
        >
          {title.slice(0, 120)}
        </h3>
        <TaskCardMenu
          taskId={taskId}
          isDisabled={isMenuDisabled}
          onRemove={onRemove}
        />
      </div>
      <span className="text-xs text-muted-foreground font-mono">
        {spentTime}
      </span>
    </div>
  )
}

export { TaskCard, taskCardVariants }
