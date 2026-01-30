import type { Task, TaskId } from '@/types/task';

export interface PersistedTaskListState {
  tasks: Task[];
  selectedTaskId: TaskId | null;
  lastUpdated: number;
}

const TASK_STORAGE_KEY = 'work-time-tracker:task-list-state';

export function saveTaskListState(
  state: Omit<PersistedTaskListState, 'lastUpdated'>
): void {
  try {
    const persistedState: PersistedTaskListState = {
      ...state,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(persistedState));
  } catch (error) {
    console.error('Failed to persist task list state:', error);
  }
}

export function loadTaskListState(): PersistedTaskListState | null {
  try {
    const stored = localStorage.getItem(TASK_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as PersistedTaskListState;
  } catch (error) {
    console.error('Failed to load task list state:', error);
    return null;
  }
}

export function clearTaskListState(): void {
  try {
    localStorage.removeItem(TASK_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear task list state:', error);
  }
}
