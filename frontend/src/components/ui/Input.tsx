import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, id, required, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const hintId = hint ? `${inputId}-hint` : undefined
    const errorId = error ? `${inputId}-error` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-800">
            {label}
            {required && (
              <span className="text-danger ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={!!error}
            aria-describedby={cn(hintId, errorId) || undefined}
            className={cn(
              'h-11 w-full rounded-lg border bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
              error ? 'border-danger' : 'border-neutral-300',
              leftIcon && 'pl-9',
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && (
          <p id={hintId} className="text-xs text-neutral-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
