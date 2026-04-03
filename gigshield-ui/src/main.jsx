import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('GigShield SW registered:', reg.scope)
        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing
          if (newSW) {
            newSW.addEventListener('statechange', () => {
              if (newSW.state === 'activated') {
                console.log('GigShield updated to latest version')
              }
            })
          }
        })
      })
      .catch((err) => console.warn('SW registration failed:', err))
  })
}
