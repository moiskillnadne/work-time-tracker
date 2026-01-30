import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface AppLayoutProps {
  timer: ReactNode;
  taskList: ReactNode;
  className?: string;
}

export function AppLayout({ timer, taskList, className }: AppLayoutProps): ReactNode {
  return (
    <div
      className={cn(
        'min-h-screen w-full bg-background',
        'flex flex-col',
        'md:flex-row',
        className
      )}
    >
      {/* TaskList Section - uses order for mobile/desktop positioning */}
      <section
        className={cn(
          'order-2 h-[50vh] w-full',
          'flex items-start justify-center',
          'overflow-y-auto',
          'p-4',
          'md:order-1 md:h-screen md:w-1/2'
        )}
      >
        {taskList}
      </section>

      {/* Timer Section */}
      <section
        className={cn(
          'order-1 h-[50vh] w-full',
          'flex items-center justify-center',
          'p-4',
          'md:order-2 md:h-screen md:w-1/2',
          'md:sticky md:top-0'
        )}
      >
        {timer}
      </section>
    </div>
  );
}
