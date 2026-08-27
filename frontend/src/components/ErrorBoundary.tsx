import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Une erreur inattendue est survenue</h1>
          <p className="mt-2 max-w-sm text-sm text-neutral-500">
            Veuillez recharger la page. Si le problème persiste, contactez le support.
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Recharger la page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
