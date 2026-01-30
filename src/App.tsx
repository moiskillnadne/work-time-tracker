import { Timer } from './components/timer'
import { TaskList } from './components/task-list';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 gap-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
        Work Time Tracker
      </h1>
      <Timer
        onStart={handleStart}
        onPause={handlePause}
        onStop={handleStop}
        onReset={handleReset}
      />
      <TaskList onAddClick={handleAddClick} />
    </div>
  );
}

export default App
