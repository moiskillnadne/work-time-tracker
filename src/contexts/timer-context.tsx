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
  type TimerStatus,
} from '@/lib/timer-storage';

export type { TimerStatus };

interface TimerState {
  status: TimerStatus;
  startTimestamp: number | null;
  accumulatedTime: number;
}

interface TimerContextValue {
  status: TimerStatus;
  elapsedTime: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  isRunning: boolean;
  isPaused: boolean;
  isIdle: boolean;
}

const TimerContext = createContext<TimerContextValue | null>(null);

function calculateElapsedTime(state: TimerState): number {
  if (state.status !== 'running' || state.startTimestamp === null) {
    return state.accumulatedTime;
  }
  return state.accumulatedTime + (Date.now() - state.startTimestamp);
}

function recoverTimerState(): TimerState {
  const stored = loadTimerState();

  if (!stored) {
    return {
      status: 'idle',
      startTimestamp: null,
      accumulatedTime: 0,
    };
  }

  return {
    status: stored.status,
    startTimestamp: stored.startTimestamp,
    accumulatedTime: stored.accumulatedTime,
  };
}

interface TimerProviderProps {
  children: ReactNode;
}

export function TimerProvider({ children }: TimerProviderProps): ReactNode {
  const [state, setState] = useState<TimerState>(recoverTimerState);
  const [elapsedTime, setElapsedTime] = useState<number>(() =>
    calculateElapsedTime(recoverTimerState())
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const persistState = useCallback((newState: TimerState): void => {
    const toPersist: Omit<PersistedTimerState, 'lastUpdated'> = {
      status: newState.status,
      startTimestamp: newState.startTimestamp,
      accumulatedTime: newState.accumulatedTime,
    };
    saveTimerState(toPersist);
  }, []);

  const start = useCallback((): void => {
    setState((prev) => {
      const newState: TimerState = {
        status: 'running',
        startTimestamp: Date.now(),
        accumulatedTime: prev.accumulatedTime,
      };
      persistState(newState);
      return newState;
    });
  }, [persistState]);

  const pause = useCallback((): void => {
    setState((prev) => {
      if (prev.status !== 'running') {
        return prev;
      }

      const currentElapsed = calculateElapsedTime(prev);
      const newState: TimerState = {
        status: 'paused',
        startTimestamp: null,
        accumulatedTime: currentElapsed,
      };
      persistState(newState);
      return newState;
    });
  }, [persistState]);

  const reset = useCallback((): void => {
    const newState: TimerState = {
      status: 'idle',
      startTimestamp: null,
      accumulatedTime: 0,
    };
    setState(newState);
    setElapsedTime(0);
    clearTimerState();
  }, []);

  useEffect(() => {
    if (state.status !== 'running') {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setElapsedTime(state.accumulatedTime);
      return;
    }

    setElapsedTime(calculateElapsedTime(state));

    intervalRef.current = setInterval(() => {
      setElapsedTime(calculateElapsedTime(state));
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.status, state.startTimestamp, state.accumulatedTime]);

  useEffect(() => {
    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible' && state.status === 'running') {
        setElapsedTime(calculateElapsedTime(state));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state]);

  useEffect(() => {
    const handleFocus = (): void => {
      if (state.status === 'running') {
        setElapsedTime(calculateElapsedTime(state));
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [state]);

  const contextValue = useMemo<TimerContextValue>(
    () => ({
      status: state.status,
      elapsedTime,
      start,
      pause,
      reset,
      isRunning: state.status === 'running',
      isPaused: state.status === 'paused',
      isIdle: state.status === 'idle',
    }),
    [state.status, elapsedTime, start, pause, reset]
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
