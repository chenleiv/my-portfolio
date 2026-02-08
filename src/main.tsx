import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/app.scss'
import App from './App'
import { FocusProvider } from './utils/FocusProvider'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <FocusProvider>
      <App />
    </FocusProvider>
  </StrictMode>
  ,
)
