import { forwardRef, useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, required, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-neutral-800">
            {label}
            {required && (
              <span className="text-danger ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          aria-invalid={!!error}
          className={cn(
            'min-h-24 w-full rounded-lg border bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
            error ? 'border-danger' : 'border-neutral-300',
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-neutral-500">{hint}</p>}
        {error && (
          <p className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
