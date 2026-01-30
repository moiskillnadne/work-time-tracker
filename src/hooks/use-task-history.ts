import { useMemo } from 'react';
import type { TaskId } from '@/types/task';
import type { HistoryEntry } from '@/types/history';
import { getTaskHistory } from '@/lib/history-storage';
import { formatTime, formatDate, getDateKey, formatTimeShort } from '@/lib/utils';

interface HistoryEntryWithFormatting extends HistoryEntry {
  formattedDuration: string;
  formattedTime: string;
}

interface HistoryGroupWithFormatting {
  date: string;
  dateLabel: string;
  entries: HistoryEntryWithFormatting[];
  totalDuration: number;
  formattedTotalDuration: string;
}

interface UseTaskHistoryReturn {
  groups: HistoryGroupWithFormatting[];
  totalDuration: number;
  formattedTotalDuration: string;
  entryCount: number;
  isEmpty: boolean;
}

export function useTaskHistory(taskId: TaskId): UseTaskHistoryReturn {
  const rawEntries = useMemo(() => getTaskHistory(taskId), [taskId]);

  const groups = useMemo<HistoryGroupWithFormatting[]>(() => {
    const groupMap = new Map<string, HistoryEntry[]>();

    for (const entry of rawEntries) {
      // Group by startedAt date (when the work segment started)
      const dateKey = getDateKey(entry.startedAt);
      const existing = groupMap.get(dateKey) ?? [];
      groupMap.set(dateKey, [...existing, entry]);
    }

    const sortedDates = Array.from(groupMap.keys()).sort((a, b) =>
      b.localeCompare(a)
    );

    return sortedDates.map((date) => {
      const entries = groupMap.get(date) ?? [];
      const totalDuration = entries.reduce((sum, e) => sum + e.duration, 0);

      // Sort by startedAt (newest first)
      const sortedEntries = [...entries].sort((a, b) =>
        b.startedAt.localeCompare(a.startedAt)
      );

      return {
        date,
        dateLabel: formatDate(sortedEntries[0].startedAt),
        entries: sortedEntries.map((entry) => ({
          ...entry,
          formattedDuration: formatTime(entry.duration),
          formattedTime: formatTimeShort(entry.startedAt),
        })),
        totalDuration,
        formattedTotalDuration: formatTime(totalDuration),
      };
    });
  }, [rawEntries]);

  const totalDuration = useMemo(
    () => rawEntries.reduce((sum, entry) => sum + entry.duration, 0),
    [rawEntries]
  );

  return {
    groups,
    totalDuration,
    formattedTotalDuration: formatTime(totalDuration),
    entryCount: rawEntries.length,
    isEmpty: rawEntries.length === 0,
  };
}
