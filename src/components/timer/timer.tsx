import { cn } from '@/lib/utils';
import { TimerDisplay } from './timer-display';
import { TimerControls } from './timer-controls';

interface TimerProps {
  className?: string;
  showControls?: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onReset?: () => void;
}

export function Timer({
  className,
  showControls = true,
  onStart,
  onPause,
  onStop,
  onReset,
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
          onStart={onStart}
          onPause={onPause}
          onStop={onStop}
          onReset={onReset}
        />
      )}
    </div>
  );
}
