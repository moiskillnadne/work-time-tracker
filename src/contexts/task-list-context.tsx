import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Task, TaskId, CreateTaskInput, UpdateTaskInput } from '@/types/task';
import {
  loadTaskListState,
  saveTaskListState,
  clearTaskListState,
  type PersistedTaskListState,
} from '@/lib/task-storage';

interface TaskListState {
  tasks: Task[];
  selectedTaskId: TaskId | null;
}

interface TaskListContextValue {
  tasks: Task[];
  selectedTaskId: TaskId | null;
  selectedTask: Task | null;
  addTask: (input: CreateTaskInput) => Task;
  updateTask: (input: UpdateTaskInput) => void;
  deleteTask: (id: TaskId) => void;
  selectTask: (id: TaskId | null) => void;
  clearAllTasks: () => void;
  incrementTaskTime: (id: TaskId, milliseconds: number) => void;
  taskCount: number;
  hasSelectedTask: boolean;
}

const TaskListContext = createContext<TaskListContextValue | null>(null);

function generateTaskId(): TaskId {
  return crypto.randomUUID();
}

function recoverTaskListState(): TaskListState {
  const stored = loadTaskListState();

  if (!stored) {
    return {
      tasks: [],
      selectedTaskId: null,
    };
  }

  return {
    tasks: stored.tasks,
    selectedTaskId: stored.selectedTaskId,
  };
}

interface TaskListProviderProps {
  children: ReactNode;
}

export function TaskListProvider({ children }: TaskListProviderProps): ReactNode {
  const [state, setState] = useState<TaskListState>(recoverTaskListState);

  const persistState = useCallback((newState: TaskListState): void => {
    const toPersist: Omit<PersistedTaskListState, 'lastUpdated'> = {
      tasks: newState.tasks,
      selectedTaskId: newState.selectedTaskId,
    };
    saveTaskListState(toPersist);
  }, []);

  const addTask = useCallback((input: CreateTaskInput): Task => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: generateTaskId(),
      title: input.title.slice(0, 120),
      elapsedTime: 0,
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => {
      const newState: TaskListState = {
        ...prev,
        tasks: [newTask, ...prev.tasks],
      };
      persistState(newState);
      return newState;
    });

    return newTask;
  }, [persistState]);

  const updateTask = useCallback((input: UpdateTaskInput): void => {
    setState((prev) => {
      const taskIndex = prev.tasks.findIndex((t) => t.id === input.id);
      if (taskIndex === -1) {
        return prev;
      }

      const updatedTask: Task = {
        ...prev.tasks[taskIndex],
        ...(input.title !== undefined && { title: input.title.slice(0, 120) }),
        ...(input.elapsedTime !== undefined && { elapsedTime: input.elapsedTime }),
        updatedAt: new Date().toISOString(),
      };

      const newTasks = [...prev.tasks];
      newTasks[taskIndex] = updatedTask;

      const newState: TaskListState = {
        ...prev,
        tasks: newTasks,
      };
      persistState(newState);
      return newState;
    });
  }, [persistState]);

  const deleteTask = useCallback((id: TaskId): void => {
    setState((prev) => {
      const newTasks = prev.tasks.filter((t) => t.id !== id);
      const newSelectedId = prev.selectedTaskId === id ? null : prev.selectedTaskId;

      const newState: TaskListState = {
        tasks: newTasks,
        selectedTaskId: newSelectedId,
      };
      persistState(newState);
      return newState;
    });
  }, [persistState]);

  const selectTask = useCallback((id: TaskId | null): void => {
    setState((prev) => {
      if (prev.selectedTaskId === id) {
        return prev;
      }

      const newState: TaskListState = {
        ...prev,
        selectedTaskId: id,
      };
      persistState(newState);
      return newState;
    });
  }, [persistState]);

  const incrementTaskTime = useCallback((id: TaskId, milliseconds: number): void => {
    setState((prev) => {
      const taskIndex = prev.tasks.findIndex((t) => t.id === id);
      if (taskIndex === -1) {
        return prev;
      }

      const updatedTask: Task = {
        ...prev.tasks[taskIndex],
        elapsedTime: prev.tasks[taskIndex].elapsedTime + milliseconds,
        updatedAt: new Date().toISOString(),
      };

      const newTasks = [...prev.tasks];
      newTasks[taskIndex] = updatedTask;

      const newState: TaskListState = {
        ...prev,
        tasks: newTasks,
      };
      persistState(newState);
      return newState;
    });
  }, [persistState]);

  const clearAllTasks = useCallback((): void => {
    const newState: TaskListState = {
      tasks: [],
      selectedTaskId: null,
    };
    setState(newState);
    clearTaskListState();
  }, []);

  const selectedTask = useMemo(
    () => state.tasks.find((t) => t.id === state.selectedTaskId) ?? null,
    [state.tasks, state.selectedTaskId]
  );

  const contextValue = useMemo<TaskListContextValue>(
    () => ({
      tasks: state.tasks,
      selectedTaskId: state.selectedTaskId,
      selectedTask,
      addTask,
      updateTask,
      deleteTask,
      selectTask,
      clearAllTasks,
      incrementTaskTime,
      taskCount: state.tasks.length,
      hasSelectedTask: state.selectedTaskId !== null,
    }),
    [
      state.tasks,
      state.selectedTaskId,
      selectedTask,
      addTask,
      updateTask,
      deleteTask,
      selectTask,
      clearAllTasks,
      incrementTaskTime,
    ]
  );

  return (
    <TaskListContext.Provider value={contextValue}>
      {children}
    </TaskListContext.Provider>
  );
}

export function useTaskListContext(): TaskListContextValue {
  const context = useContext(TaskListContext);
  if (context === null) {
    throw new Error('useTaskListContext must be used within a TaskListProvider');
  }
  return context;
}
