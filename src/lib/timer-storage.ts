import type { TimeSegment, TimerStatus } from '@/types/timer';

export interface PersistedTimerState {
  status: TimerStatus;
  segments: TimeSegment[];
  lastUpdated: number;
}

const TIMER_STORAGE_KEY = 'work-time-tracker:timer-state';

export function saveTimerState(state: Omit<PersistedTimerState, 'lastUpdated'>): void {
  try {
    const persistedState: PersistedTimerState = {
      ...state,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(persistedState));
  } catch (error) {
    console.error('Failed to persist timer state:', error);
  }
}

export function loadTimerState(): PersistedTimerState | null {
  try {
    const stored = localStorage.getItem(TIMER_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored) as PersistedTimerState;
  } catch (error) {
    console.error('Failed to load timer state:', error);
    return null;
  }
}

export function clearTimerState(): void {
  try {
    localStorage.removeItem(TIMER_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear timer state:', error);
  }
}
