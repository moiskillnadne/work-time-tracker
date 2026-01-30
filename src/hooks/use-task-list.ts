import { useCallback, useMemo } from 'react';
import { useTaskListContext } from '@/contexts/task-list-context';
import { formatTime } from '@/lib/utils';
import type { Task, TaskId, CreateTaskInput, UpdateTaskInput } from '@/types/task';

interface TaskListCallbacks {
  onTaskAdded?: (task: Task) => void;
  onTaskDeleted?: (id: TaskId) => void;
  onTaskSelected?: (id: TaskId | null) => void;
}

interface TaskWithFormattedTime extends Task {
  formattedTime: string;
}

interface UseTaskListReturn {
  tasks: TaskWithFormattedTime[];
  selectedTaskId: TaskId | null;
  selectedTask: TaskWithFormattedTime | null;
  addTask: (input: CreateTaskInput) => Task;
  updateTask: (input: UpdateTaskInput) => void;
  deleteTask: (id: TaskId) => void;
  selectTask: (id: TaskId | null) => void;
  clearAllTasks: () => void;
  incrementTaskTime: (id: TaskId, milliseconds: number) => void;
  taskCount: number;
  hasSelectedTask: boolean;
  isEmpty: boolean;
}

export function useTaskList(callbacks?: TaskListCallbacks): UseTaskListReturn {
  const context = useTaskListContext();

  const tasksWithFormattedTime = useMemo<TaskWithFormattedTime[]>(
    () => context.tasks.map((task) => ({
      ...task,
      formattedTime: formatTime(task.elapsedTime),
    })),
    [context.tasks]
  );

  const selectedTaskWithFormattedTime = useMemo<TaskWithFormattedTime | null>(
    () => {
      if (!context.selectedTask) {
        return null;
      }
      return {
        ...context.selectedTask,
        formattedTime: formatTime(context.selectedTask.elapsedTime),
      };
    },
    [context.selectedTask]
  );

  const addTask = useCallback((input: CreateTaskInput): Task => {
    const task = context.addTask(input);
    callbacks?.onTaskAdded?.(task);
    return task;
  }, [context, callbacks]);

  const deleteTask = useCallback((id: TaskId): void => {
    context.deleteTask(id);
    callbacks?.onTaskDeleted?.(id);
  }, [context, callbacks]);

  const selectTask = useCallback((id: TaskId | null): void => {
    context.selectTask(id);
    callbacks?.onTaskSelected?.(id);
  }, [context, callbacks]);

  return {
    tasks: tasksWithFormattedTime,
    selectedTaskId: context.selectedTaskId,
    selectedTask: selectedTaskWithFormattedTime,
    addTask,
    updateTask: context.updateTask,
    deleteTask,
    selectTask,
    clearAllTasks: context.clearAllTasks,
    incrementTaskTime: context.incrementTaskTime,
    taskCount: context.taskCount,
    hasSelectedTask: context.hasSelectedTask,
    isEmpty: context.taskCount === 0,
  };
}
