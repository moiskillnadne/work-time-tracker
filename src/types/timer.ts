/**
 * A single time tracking segment representing a period of active work
 */
export interface TimeSegment {
  /** Unix timestamp (ms) when this segment started */
  start: number;
  /** Unix timestamp (ms) when this segment ended, null if currently running */
  end: number | null;
}

/**
 * Timer status
 */
export type TimerStatus = 'idle' | 'running' | 'paused';
