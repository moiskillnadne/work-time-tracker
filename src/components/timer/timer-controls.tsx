import { Pause, Play, RotateCcw, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTimer } from '@/hooks/use-timer';

interface TimerControlsCallbacks {
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onReset?: () => void;
}

interface TimerControlsProps extends TimerControlsCallbacks {
  className?: string;
}

export function TimerControls({
  className,
  onStart,
  onPause,
  onStop,
  onReset,
}: TimerControlsProps): React.ReactNode {
  const { start, pause, stop, reset, isRunning, isIdle, isStopped } = useTimer({
    onStart,
    onPause,
    onStop,
    onReset,
  });

  const handleStartPause = (): void => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  return (
    <div
      data-slot="timer-controls"
      className={cn(
        'flex flex-wrap items-center justify-center gap-2',
        'sm:gap-3 md:gap-4',
        className
      )}
    >
      <Button
        onClick={handleStartPause}
        variant={isRunning ? 'outline' : 'outline'}
        size="lg"
        className="min-w-24 sm:min-w-28 "
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? (
          <>
            <Pause className="size-4 sm:size-5" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="size-4 sm:size-5" />
            <span>Start</span>
          </>
        )}
      </Button>

      {!isIdle && (
        <Button
          onClick={stop}
          variant="outline"
          size="lg"
          className="min-w-24 sm:min-w-28"
          aria-label="Stop timer"
          disabled={isStopped}
        >
          <Square className="size-4 sm:size-5" />
          <span>Stop</span>
        </Button>
      )}

      {isStopped && (
        <Button
          onClick={reset}
          variant="outline"
          size="lg"
          className="min-w-24 sm:min-w-28"
          aria-label="Reset timer"
        >
          <RotateCcw className="size-4 sm:size-5" />
          <span>Reset</span>
        </Button>
      )}
    </div>
  );
}
