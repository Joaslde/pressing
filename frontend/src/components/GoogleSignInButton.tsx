import { useEffect, useRef } from 'react'
import { Spinner } from '@/components/ui/Spinner'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
          }) => void
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
const CLIENT_ID = GOOGLE_CLIENT_ID

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void
  /** True while the credential is being exchanged with our API. */
  isLoading?: boolean
}

/**
 * Renders Google's own "Sign in with Google" button (Google Identity
 * Services script, loaded in index.html). The button hands us a signed ID
 * token, verified server-side in AuthController::google() - never trusted
 * as-is on the frontend.
 *
 * Renders nothing if VITE_GOOGLE_CLIENT_ID isn't configured, so the rest of
 * auth keeps working locally/in demos without Google credentials set up.
 *
 * Google's button lives in a cross-origin iframe we can't style, so the
 * loading state is an overlay on top of it rather than a spinner inside.
 * The button stays mounted underneath so it doesn't need re-rendering if
 * the sign-in fails and the user tries again.
 */
export function GoogleSignInButton({ onCredential, isLoading = false }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onCredentialRef = useRef(onCredential)
  onCredentialRef.current = onCredential

  useEffect(() => {
    if (!CLIENT_ID) return

    let cancelled = false
    let attempts = 0

    const tryInit = () => {
      if (cancelled) return
      if (window.google?.accounts?.id && containerRef.current) {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => onCredentialRef.current(response.credential),
        })
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: 360,
          text: 'continue_with',
          locale: 'fr',
        })
        return
      }
      attempts += 1
      // The gsi/client script loads async - give it a few seconds before giving up.
      if (attempts < 50) setTimeout(tryInit, 100)
    }

    tryInit()
    return () => {
      cancelled = true
    }
  }, [])

  if (!CLIENT_ID) return null

  return (
    <div className="relative mx-auto w-fit" aria-busy={isLoading}>
      <div ref={containerRef} className="flex justify-center" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white text-sm font-medium text-neutral-600">
          <Spinner size={18} className="text-primary-500" />
          Connexion en cours...
        </div>
      )}
    </div>
  )
}
