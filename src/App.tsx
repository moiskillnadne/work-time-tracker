import { Timer } from './components/timer'

function App() {
  const handleStart = () => {
    console.log('Timer started');
  };

  const handlePause = () => {
    console.log('Timer paused');
  };

  const handleStop = () => {
    console.log('Timer stopped');
  };

  const handleReset = () => {
    console.log('Timer reset');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8">
        Work Time Tracker
      </h1>
      <Timer
        onStart={handleStart}
        onPause={handlePause}
        onStop={handleStop}
        onReset={handleReset}
      />
    </div>
  );
}

export default App
