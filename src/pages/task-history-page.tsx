import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskHistory } from '@/hooks/use-task-history';
import { useTaskList } from '@/hooks/use-task-list';
import { cn } from '@/lib/utils';

export function TaskHistoryPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { tasks } = useTaskList();

  const task = tasks.find((t) => t.id === taskId);
  const { groups, formattedTotalDuration, entryCount, isEmpty } = useTaskHistory(
    taskId ?? ''
  );

  if (!taskId || !task) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Task Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            This task may have been deleted.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Go Back</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleGoBack = (): void => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            aria-label="Go back"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">{task.title}</h1>
            <p className="text-xs text-muted-foreground">
              {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
              {' '}&middot;{' '}
              Total: {formattedTotalDuration}
            </p>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        {isEmpty ? (
          <EmptyHistoryState />
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <HistoryGroupSection key={group.date} group={group} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyHistoryState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Clock className="size-12 text-muted-foreground/50" />
      <h2 className="mt-4 text-lg font-medium text-foreground">No history yet</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Time tracking entries will appear here after you save time to this task.
      </p>
    </div>
  );
}

interface HistoryGroupSectionProps {
  group: {
    date: string;
    dateLabel: string;
    entries: Array<{
      id: string;
      formattedDuration: string;
      formattedTime: string;
    }>;
    formattedTotalDuration: string;
  };
}

function HistoryGroupSection({ group }: HistoryGroupSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-foreground">{group.dateLabel}</h2>
        <span className="text-xs text-muted-foreground font-mono">
          {group.formattedTotalDuration}
        </span>
      </div>

      <div className="space-y-2">
        {group.entries.map((entry) => (
          <HistoryEntryRow key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}

interface HistoryEntryRowProps {
  entry: {
    id: string;
    formattedDuration: string;
    formattedTime: string;
  };
}

function HistoryEntryRow({ entry }: HistoryEntryRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'rounded-lg border bg-card p-3',
        'text-sm'
      )}
    >
      <span className="text-muted-foreground">{entry.formattedTime}</span>
      <span className="font-mono font-medium">{entry.formattedDuration}</span>
    </div>
  );
}
