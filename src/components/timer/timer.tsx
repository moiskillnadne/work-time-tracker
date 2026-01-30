import { cn } from '@/lib/utils';
import { TimerDisplay } from './timer-display';
import { TimerControls } from './timer-controls';

interface TimerProps {
  className?: string;
  showControls?: boolean;
  isTaskSelected?: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onSaveAndReset?: () => void;
}

export function Timer({
  className,
  showControls = true,
  isTaskSelected = false,
  onStart,
  onPause,
  onStop,
  onSaveAndReset,
}: TimerProps): React.ReactNode {
  return (
    <div
      data-slot="timer"
      className={cn(
        'flex flex-col items-center justify-center gap-6',
        'sm:gap-8 md:gap-10',
        'p-4 sm:p-6 md:p-8',
        'w-full max-w-md mx-auto',
        className
      )}
    >
      <TimerDisplay />
      {showControls && (
        <TimerControls
          isTaskSelected={isTaskSelected}
          onStart={onStart}
          onPause={onPause}
          onStop={onStop}
          onSaveAndReset={onSaveAndReset}
        />
      )}
    </div>
  );
}
