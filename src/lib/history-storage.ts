import type { TaskId } from '@/types/task';
import type { HistoryEntry } from '@/types/history';
import type { TimeSegment } from '@/types/timer';
import { splitSegmentsByDay } from '@/lib/utils';

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

/**
 * Creates history entries from time segments, splitting across day boundaries
 * Multiple segments on the same day are aggregated into a single entry
 */
export function addHistoryEntriesFromSegments(
  taskId: TaskId,
  segments: TimeSegment[]
): HistoryEntry[] {
  const daySplits = splitSegmentsByDay(segments);
  const savedAt = new Date().toISOString();

  const newEntries: HistoryEntry[] = daySplits.map((split) => ({
    id: crypto.randomUUID(),
    taskId,
    duration: split.duration,
    startedAt: split.startedAt,
    savedAt,
  }));

  const current = loadHistoryState();
  const existingEntries = current?.entries ?? [];

  // Prepend new entries (newest first)
  saveHistoryState({ entries: [...newEntries, ...existingEntries] });

  return newEntries;
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
