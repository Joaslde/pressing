import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Spinner } from './Spinner'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-300',
  secondary:
    'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950 disabled:bg-neutral-300',
  outline:
    'border border-neutral-300 text-neutral-800 bg-white hover:bg-neutral-50 active:bg-neutral-100 disabled:text-neutral-400',
  ghost: 'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 disabled:text-neutral-400',
  danger: 'bg-danger text-white hover:brightness-110 active:brightness-95 disabled:opacity-50',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-sm gap-2',
  lg: 'h-13 px-6 text-base gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Spinner size={size === 'sm' ? 14 : 16} className="text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
