import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { API_BASE_URL } from './env'

// Wake up the Render free-tier API as early as possible to minimize cold-start delay.
fetch(`${API_BASE_URL}/libros/home`, { credentials: 'include' }).catch(() => {})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
