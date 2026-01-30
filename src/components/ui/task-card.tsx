import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

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
  /** Task title (max 120 characters, truncated with ellipsis) */
  title: string
  /** Time spent on task in "hh:mm:ss" format */
  spentTime: string
  /** Whether the card is selected */
  isSelected?: boolean
}

function TaskCard({
  className,
  title,
  spentTime,
  isSelected = false,
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
      <h3
        className="text-sm font-medium text-foreground truncate max-w-full"
        title={title}
      >
        {title.slice(0, 120)}
      </h3>
      <span className="text-xs text-muted-foreground font-mono">
        {spentTime}
      </span>
    </div>
  )
}

export { TaskCard, taskCardVariants }
