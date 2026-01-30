import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TimerProvider } from './contexts/timer-context'
import { TaskListProvider } from './contexts/task-list-context'
import { Toaster } from './components/ui/sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaskListProvider>
      <TimerProvider>
        <App />
        <Toaster />
      </TimerProvider>
    </TaskListProvider>
  </StrictMode>,
)
