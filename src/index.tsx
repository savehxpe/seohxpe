import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RootLayout from './app/layout'
import Home from './app/page'

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <RootLayout>
      <Home />
    </RootLayout>
  </StrictMode>
)
