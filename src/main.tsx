import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TimerProvider } from './contexts/timer-context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TimerProvider>
      <App />
    </TimerProvider>
  </StrictMode>,
)
