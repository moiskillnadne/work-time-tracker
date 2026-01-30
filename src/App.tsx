import { useState } from 'react';
import { Timer } from './components/timer'
import { TaskList } from './components/task-list';
import { AppLayout } from './components/layout';
import { TaskNameModal, type TaskNameModalPayload } from './components/ui/task-name-modal';
import { useTaskListContext } from './contexts/task-list-context';

function App() {
  const { addTask } = useTaskListContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleStart = (): void => {
    console.log('Timer started');
  };

  const handlePause = (): void => {
    console.log('Timer paused');
  };

  const handleStop = (): void => {
    console.log('Timer stopped');
  };

  const handleReset = (): void => {
    console.log('Timer reset');
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
            onStart={handleStart}
            onPause={handlePause}
            onStop={handleStop}
            onReset={handleReset}
          />
        }
        taskList={<TaskList onAddClick={handleAddClick} />}
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

export default App
