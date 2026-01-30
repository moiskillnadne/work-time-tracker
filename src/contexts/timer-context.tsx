import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  clearTimerState,
  loadTimerState,
  saveTimerState,
  type PersistedTimerState,
} from '@/lib/timer-storage';
import type { TimeSegment, TimerStatus } from '@/types/timer';

export type { TimerStatus, TimeSegment };

interface TimerState {
  status: TimerStatus;
  segments: TimeSegment[];
}

interface TimerContextValue {
  status: TimerStatus;
  elapsedTime: number;
  segments: TimeSegment[];
  start: () => void;
  pause: () => void;
  reset: () => void;
  isRunning: boolean;
  isPaused: boolean;
  isIdle: boolean;
}

const TimerContext = createContext<TimerContextValue | null>(null);

/**
 * Calculates total elapsed time from segments
 * For running segments (end === null), uses current time
 */
function calculateElapsedTime(segments: TimeSegment[]): number {
  return segments.reduce((total, segment) => {
    const end = segment.end ?? Date.now();
    return total + (end - segment.start);
  }, 0);
}

function recoverTimerState(): TimerState {
  const stored = loadTimerState();

  if (!stored) {
    return {
      status: 'idle',
      segments: [],
    };
  }

  return {
    status: stored.status,
    segments: stored.segments,
  };
}

interface TimerProviderProps {
  children: ReactNode;
}

export function TimerProvider({ children }: TimerProviderProps): ReactNode {
  const [state, setState] = useState<TimerState>(recoverTimerState);
  const [elapsedTime, setElapsedTime] = useState<number>(() =>
    calculateElapsedTime(recoverTimerState().segments)
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const persistState = useCallback((newState: TimerState): void => {
    const toPersist: Omit<PersistedTimerState, 'lastUpdated'> = {
      status: newState.status,
      segments: newState.segments,
    };
    saveTimerState(toPersist);
  }, []);

  const start = useCallback((): void => {
    setState((prev) => {
      // Create a new segment with current time as start
      const newSegment: TimeSegment = {
        start: Date.now(),
        end: null,
      };

      const newState: TimerState = {
        status: 'running',
        segments: [...prev.segments, newSegment],
      };
      persistState(newState);
      return newState;
    });
  }, [persistState]);

  const pause = useCallback((): void => {
    setState((prev) => {
      if (prev.status !== 'running' || prev.segments.length === 0) {
        return prev;
      }

      // Close the last segment by setting its end time
      const lastIndex = prev.segments.length - 1;
      const updatedSegments = prev.segments.map((segment, index) =>
        index === lastIndex && segment.end === null
          ? { ...segment, end: Date.now() }
          : segment
      );

      const newState: TimerState = {
        status: 'paused',
        segments: updatedSegments,
      };
      persistState(newState);
      return newState;
    });
  }, [persistState]);

  const reset = useCallback((): void => {
    const newState: TimerState = {
      status: 'idle',
      segments: [],
    };
    setState(newState);
    setElapsedTime(0);
    clearTimerState();
  }, []);

  // Update elapsed time when running
  useEffect(() => {
    if (state.status !== 'running') {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setElapsedTime(calculateElapsedTime(state.segments));
      return;
    }

    setElapsedTime(calculateElapsedTime(state.segments));

    intervalRef.current = setInterval(() => {
      setElapsedTime(calculateElapsedTime(state.segments));
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.status, state.segments]);

  // Handle visibility change (tab becomes visible)
  useEffect(() => {
    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible' && state.status === 'running') {
        setElapsedTime(calculateElapsedTime(state.segments));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state.status, state.segments]);

  // Handle window focus
  useEffect(() => {
    const handleFocus = (): void => {
      if (state.status === 'running') {
        setElapsedTime(calculateElapsedTime(state.segments));
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [state.status, state.segments]);

  const contextValue = useMemo<TimerContextValue>(
    () => ({
      status: state.status,
      elapsedTime,
      segments: state.segments,
      start,
      pause,
      reset,
      isRunning: state.status === 'running',
      isPaused: state.status === 'paused',
      isIdle: state.status === 'idle',
    }),
    [state.status, state.segments, elapsedTime, start, pause, reset]
  );

  return <TimerContext.Provider value={contextValue}>{children}</TimerContext.Provider>;
}

export function useTimerContext(): TimerContextValue {
  const context = useContext(TimerContext);
  if (context === null) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
}
