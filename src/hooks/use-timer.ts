import { useCallback, useMemo } from 'react';
import { useTimerContext, type TimerStatus } from '@/contexts/timer-context';
import { formatTime } from '@/lib/utils';

interface TimerCallbacks {
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
}

interface UseTimerReturn {
  elapsedTime: number;
  status: TimerStatus;
  formattedTime: string;
  hours: number;
  minutes: number;
  seconds: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  isRunning: boolean;
  isPaused: boolean;
  isIdle: boolean;
}

export function useTimer(callbacks?: TimerCallbacks): UseTimerReturn {
  const context = useTimerContext();

  const { hours, minutes, seconds } = useMemo(() => {
    const totalSeconds = Math.floor(context.elapsedTime / 1000);
    return {
      hours: Math.floor(totalSeconds / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  }, [context.elapsedTime]);

  const formattedTime = useMemo(
    () => formatTime(context.elapsedTime),
    [context.elapsedTime]
  );

  const start = useCallback((): void => {
    context.start();
    callbacks?.onStart?.();
  }, [context, callbacks]);

  const pause = useCallback((): void => {
    context.pause();
    callbacks?.onPause?.();
  }, [context, callbacks]);

  const reset = useCallback((): void => {
    context.reset();
    callbacks?.onReset?.();
  }, [context, callbacks]);

  return {
    elapsedTime: context.elapsedTime,
    status: context.status,
    formattedTime,
    hours,
    minutes,
    seconds,
    start,
    pause,
    reset,
    isRunning: context.isRunning,
    isPaused: context.isPaused,
    isIdle: context.isIdle,
  };
}
