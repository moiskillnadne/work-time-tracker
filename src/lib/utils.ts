import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TimeSegment } from "@/types/timer"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Extracts the local date (YYYY-MM-DD) from a Date object
 */
function getLocalDateFromDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats an ISO date string to a user-friendly label
 * Returns "Today", "Yesterday", or a formatted date like "January 15, 2026"
 * Uses the user's local timezone for date comparisons
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = getLocalDateFromDate(date);
  const todayOnly = getLocalDateFromDate(today);
  const yesterdayOnly = getLocalDateFromDate(yesterday);

  if (dateOnly === todayOnly) {
    return 'Today';
  }
  if (dateOnly === yesterdayOnly) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Extracts the local date key (YYYY-MM-DD) from an ISO timestamp
 * Uses the user's local timezone, not UTC
 */
export function getDateKey(isoString: string): string {
  const date = new Date(isoString);
  return getLocalDateFromDate(date);
}

/**
 * Formats an ISO timestamp to a short time string like "2:30 PM"
 */
export function formatTimeShort(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * A duration split by day for a time segment
 */
export interface DaySplit {
  /** Date in YYYY-MM-DD format (local timezone) */
  date: string;
  /** Duration in milliseconds for this day */
  duration: number;
  /** ISO timestamp when this portion started */
  startedAt: string;
}

/**
 * Gets the start of the next day (midnight) in local timezone
 */
function getNextMidnight(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  next.setHours(0, 0, 0, 0);
  return next;
}

/**
 * Splits a single time segment across midnight boundaries
 * Returns an array of DaySplit, one for each day the segment spans
 */
export function splitSegmentByDay(segment: TimeSegment): DaySplit[] {
  const startTime = segment.start;
  const endTime = segment.end ?? Date.now();

  if (endTime <= startTime) {
    return [];
  }

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  const startDateKey = getLocalDateFromDate(startDate);
  const endDateKey = getLocalDateFromDate(endDate);

  // Same day - return single split
  if (startDateKey === endDateKey) {
    return [{
      date: startDateKey,
      duration: endTime - startTime,
      startedAt: new Date(startTime).toISOString(),
    }];
  }

  // Different days - split at midnight boundaries
  const splits: DaySplit[] = [];
  let currentStart = startTime;

  while (true) {
    const currentDate = new Date(currentStart);
    const currentDateKey = getLocalDateFromDate(currentDate);
    const nextMidnight = getNextMidnight(currentDate);
    const nextMidnightTime = nextMidnight.getTime();

    if (nextMidnightTime >= endTime) {
      // Last segment - from current start to end
      splits.push({
        date: currentDateKey,
        duration: endTime - currentStart,
        startedAt: new Date(currentStart).toISOString(),
      });
      break;
    }

    // Segment from current start to midnight
    splits.push({
      date: currentDateKey,
      duration: nextMidnightTime - currentStart,
      startedAt: new Date(currentStart).toISOString(),
    });

    currentStart = nextMidnightTime;
  }

  return splits;
}

/**
 * Splits multiple time segments and aggregates by day
 * Multiple segments on the same day are combined into a single DaySplit
 */
export function splitSegmentsByDay(segments: TimeSegment[]): DaySplit[] {
  const dayMap = new Map<string, { duration: number; earliestStart: string }>();

  for (const segment of segments) {
    const splits = splitSegmentByDay(segment);

    for (const split of splits) {
      const existing = dayMap.get(split.date);

      if (existing) {
        // Aggregate: sum duration, keep earliest start time
        dayMap.set(split.date, {
          duration: existing.duration + split.duration,
          earliestStart: split.startedAt < existing.earliestStart
            ? split.startedAt
            : existing.earliestStart,
        });
      } else {
        dayMap.set(split.date, {
          duration: split.duration,
          earliestStart: split.startedAt,
        });
      }
    }
  }

  // Convert map to array and sort by date
  return Array.from(dayMap.entries())
    .map(([date, data]) => ({
      date,
      duration: data.duration,
      startedAt: data.earliestStart,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
