import { Timer } from './components/timer'
import { TaskList } from './components/task-list';
import { AppLayout } from './components/layout';

function App() {
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
    console.log('Add task clicked');
  };

  return (
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
  );
}

export default App
