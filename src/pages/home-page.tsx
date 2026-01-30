import { useState } from 'react';
import { Timer } from '@/components/timer';
import { TaskList } from '@/components/task-list';
import { AppLayout } from '@/components/layout';
import { TaskNameModal, type TaskNameModalPayload } from '@/components/ui/task-name-modal';
import { useTaskList } from '@/hooks/use-task-list';
import { useTimer } from '@/hooks/use-timer';
import type { TimeSegment } from '@/types/timer';

export function HomePage() {
  const { addTask, selectedTaskId, hasSelectedTask, incrementTaskTime } = useTaskList();
  const { elapsedTime, isIdle, segments } = useTimer();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isTimerActive = !isIdle;

  const handleSaveAndReset = (): void => {
    if (selectedTaskId && elapsedTime > 0 && segments.length > 0) {
      // Close the running segment (if any) before saving
      const closedSegments: TimeSegment[] = segments.map((seg, index) =>
        index === segments.length - 1 && seg.end === null
          ? { ...seg, end: Date.now() }
          : seg
      );
      incrementTaskTime(selectedTaskId, elapsedTime, closedSegments);
    }
  };

  const handleAddClick = (): void => {
    setIsAddModalOpen(true);
  };

  const handleAddCancel = (): void => {
    setIsAddModalOpen(false);
  };

  const handleAddConfirm = (payload: TaskNameModalPayload): void => {
    addTask({ title: payload.taskName });
    setIsAddModalOpen(false);
  };

  return (
    <>
      <AppLayout
        timer={
          <Timer
            isTaskSelected={hasSelectedTask}
            onSaveAndReset={handleSaveAndReset}
          />
        }
        taskList={<TaskList onAddClick={handleAddClick} isTimerActive={isTimerActive} />}
      />
      <TaskNameModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onCancel={handleAddCancel}
        onConfirm={handleAddConfirm}
        title="Add Task"
      />
    </>
  );
}
