import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddTaskButtonProps {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function AddTaskButton({
  className,
  onClick,
  disabled = false,
}: AddTaskButtonProps): React.ReactNode {
  return (
    <Button
      data-slot="add-task-button"
      variant="outline"
      size="lg"
      className={cn(
        'w-full h-14 text-lg font-medium',
        'border-dashed border-2',
        'hover:border-primary hover:text-primary',
        'transition-colors',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label="Add new task"
    >
      <Plus className="size-6" />
      <span>Add Task</span>
    </Button>
  );
}
