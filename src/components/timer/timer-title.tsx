import { useTimer } from '@/hooks/use-timer';
import { useDocumentTitle } from '@/hooks/use-document-title';
import type { TimerStatus } from '@/types/timer';

const BASE_TITLE = 'Work Time Tracker';

function getTimerTitle(status: TimerStatus, formattedTime: string): string {
  switch (status) {
    case 'running':
      return `▶ ${formattedTime} - ${BASE_TITLE}`;
    case 'paused':
      return `⏸ ${formattedTime} - ${BASE_TITLE}`;
    default:
      return BASE_TITLE;
  }
}

export function TimerTitle(): null {
  const { status, formattedTime } = useTimer();
  const title = getTimerTitle(status, formattedTime);

  useDocumentTitle(title);

  return null;
}
