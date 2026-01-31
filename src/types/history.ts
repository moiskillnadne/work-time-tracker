import type { TaskId } from './task';

/**
 * Unique identifier for a history entry
 */
export type HistoryEntryId = string;

/**
 * A single time tracking history entry
 */
export interface HistoryEntry {
  /** Unique identifier (UUID) */
  id: HistoryEntryId;
  /** Reference to the task this entry belongs to */
  taskId: TaskId;
  /** Amount of time saved in milliseconds */
  duration: number;
  /** ISO timestamp when the time was saved */
  savedAt: string;
}

/**
 * History entries grouped by date
 */
export interface HistoryGroup {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Display-friendly date label (e.g., "Today", "Yesterday", "January 15, 2026") */
  dateLabel: string;
  /** History entries for this date, sorted newest first */
  entries: HistoryEntry[];
  /** Total time for this date in milliseconds */
  totalDuration: number;
}
