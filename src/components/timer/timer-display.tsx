import { cn } from '@/lib/utils';
import { useTimer } from '@/hooks/use-timer';

interface TimerDisplayProps {
  className?: string;
}

export function TimerDisplay({ className }: TimerDisplayProps): React.ReactNode {
  const { formattedTime, isRunning, isPaused, isStopped } = useTimer();

  return (
    <div
      data-slot="timer-display"
      data-status={isRunning ? 'running' : isPaused ? 'paused' : isStopped ? 'stopped' : 'idle'}
      className={cn(
        'font-mono text-4xl font-bold tracking-wider tabular-nums',
        'sm:text-5xl md:text-6xl lg:text-7xl',
        'text-foreground transition-colors',
        isRunning && 'text-primary',
        isPaused && 'text-muted-foreground',
        isStopped && 'text-destructive',
        className
      )}
      aria-live="polite"
      aria-atomic="true"
      role="timer"
    >
      {formattedTime}
    </div>
  );
}
