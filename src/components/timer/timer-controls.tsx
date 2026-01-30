import { Pause, Play, Save, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTimer } from '@/hooks/use-timer';

interface TimerControlsCallbacks {
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onSaveAndReset?: () => void;
}

interface TimerControlsProps extends TimerControlsCallbacks {
  className?: string;
  isTaskSelected?: boolean;
}

export function TimerControls({
  className,
  onStart,
  onPause,
  onStop,
  onSaveAndReset,
  isTaskSelected = false,
}: TimerControlsProps): React.ReactNode {
  const { start, pause, stop, reset, isRunning, isIdle, isStopped } = useTimer({
    onStart,
    onPause,
    onStop,
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
        variant="outline"
        size="lg"
        className="min-w-24 sm:min-w-28 "
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        disabled={!isTaskSelected && isIdle}
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
          onClick={() => {
            onSaveAndReset?.();
            reset();
          }}
          variant="outline"
          size="lg"
          className="min-w-24 sm:min-w-28"
          aria-label="Save and reset timer"
        >
          <Save className="size-4 sm:size-5" />
          <span>Save & Reset</span>
        </Button>
      )}
    </div>
  );
}
