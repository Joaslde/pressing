import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Read the latest onClose without putting it in the effect's deps: callers
  // pass a fresh inline function on every render, and this effect must only
  // run when `open` actually flips - otherwise it re-steals focus into the
  // dialog container on every keystroke typed in the modal's own form.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-neutral-900/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        className={cn(
          'relative w-full rounded-xl bg-white shadow-xl focus:outline-none',
          'max-h-[90vh] overflow-y-auto',
          sizeClasses[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <h2 id="modal-title" className="text-base font-semibold text-neutral-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body
  )
}
