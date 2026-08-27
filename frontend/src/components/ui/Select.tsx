import { forwardRef, useId } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, id, required, children, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-neutral-800">
            {label}
            {required && (
              <span className="text-danger ml-0.5" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={!!error}
          className={cn(
            'h-11 w-full rounded-lg border bg-white px-3 text-sm text-neutral-900',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500',
            error ? 'border-danger' : 'border-neutral-300',
            className
          )}
          {...props}
        >
          {children}
        </select>
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

Select.displayName = 'Select'
