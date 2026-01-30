import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TimerProvider } from './contexts/timer-context'
import { TaskListProvider } from './contexts/task-list-context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaskListProvider>
      <TimerProvider>
        <App />
      </TimerProvider>
    </TaskListProvider>
  </StrictMode>,
)
