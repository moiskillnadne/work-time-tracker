import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { TaskCard } from '@/components/ui/task-card';
import { AddTaskButton } from './add-task-button';
import { useTaskList } from '@/hooks/use-task-list';
import type { TaskId } from '@/types/task';

interface TaskListCallbacks {
  onAddClick?: () => void;
  onTaskSelect?: (id: TaskId | null) => void;
}

interface TaskListProps extends TaskListCallbacks {
  className?: string;
  isTimerActive?: boolean;
}

export function TaskList({
  className,
  onAddClick,
  onTaskSelect,
  isTimerActive = false,
}: TaskListProps): React.ReactNode {
  const { tasks, selectedTaskId, selectTask, deleteTask, isEmpty } = useTaskList({
    onTaskSelected: onTaskSelect,
  });

  const handleTaskClick = (taskId: TaskId): void => {
    if (isTimerActive) {
      toast.warning('Stop the timer before changing tasks');
      return;
    }
    const newSelectedId = selectedTaskId === taskId ? null : taskId;
    selectTask(newSelectedId);
  };

  const handleTaskRemove = (taskId: TaskId): void => {
    deleteTask(taskId);
    toast.success('Task removed');
  };

  const isMenuDisabledForTask = (taskId: TaskId): boolean => {
    return isTimerActive && selectedTaskId === taskId;
  };

  return (
    <div
      data-slot="task-list"
      className={cn(
        'flex flex-col gap-3 w-full max-w-md',
        className
      )}
    >
      <AddTaskButton onClick={onAddClick} />

      {isEmpty ? (
        <div
          data-slot="task-list-empty"
          className="text-center text-muted-foreground py-8"
        >
          <p className="text-sm">No tasks yet</p>
          <p className="text-xs mt-1">Click the button above to add your first task</p>
        </div>
      ) : (
        <div
          data-slot="task-list-items"
          className="flex flex-col gap-2"
          role="list"
          aria-label="Task list"
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              taskId={task.id}
              title={task.title}
              spentTime={task.formattedTime}
              isSelected={selectedTaskId === task.id}
              isMenuDisabled={isMenuDisabledForTask(task.id)}
              onClick={() => handleTaskClick(task.id)}
              onRemove={handleTaskRemove}
              role="listitem"
            />
          ))}
        </div>
      )}
    </div>
  );
}
