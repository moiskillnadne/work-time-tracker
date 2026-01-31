import type { TaskId } from '@/types/task';
import type { HistoryEntry } from '@/types/history';

export interface PersistedHistoryState {
  entries: HistoryEntry[];
  lastUpdated: number;
}

const HISTORY_STORAGE_KEY = 'work-time-tracker:history-state';

export function saveHistoryState(
  state: Omit<PersistedHistoryState, 'lastUpdated'>
): void {
  try {
    const persistedState: PersistedHistoryState = {
      ...state,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(persistedState));
  } catch (error) {
    console.error('Failed to persist history state:', error);
  }
}

export function loadHistoryState(): PersistedHistoryState | null {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as PersistedHistoryState;
  } catch (error) {
    console.error('Failed to load history state:', error);
    return null;
  }
}

export function clearHistoryState(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history state:', error);
  }
}

export function addHistoryEntry(taskId: TaskId, duration: number): HistoryEntry {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    taskId,
    duration,
    savedAt: new Date().toISOString(),
  };

  const current = loadHistoryState();
  const entries = current?.entries ?? [];

  saveHistoryState({ entries: [entry, ...entries] });

  return entry;
}

export function deleteTaskHistory(taskId: TaskId): void {
  const current = loadHistoryState();
  if (!current) {
    return;
  }

  const filteredEntries = current.entries.filter(
    (entry) => entry.taskId !== taskId
  );

  saveHistoryState({ entries: filteredEntries });
}

export function getTaskHistory(taskId: TaskId): HistoryEntry[] {
  const current = loadHistoryState();
  if (!current) {
    return [];
  }

  return current.entries.filter((entry) => entry.taskId === taskId);
}
