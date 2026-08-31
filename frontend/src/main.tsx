import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ScrollToTop } from './components/ScrollToTop'
import { Toaster } from './components/ui/Toaster'
import { queryClient } from './lib/queryClient'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <App />
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
)
