import { forwardRef, useState } from 'react'
import type { ComponentProps } from 'react'
import { Input } from './Input'
import { IconEye, IconEyeOff } from './icons'

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type' | 'rightElement'>

/**
 * Password field with an eye button to reveal what's being typed. The
 * toggle is a plain type="button" so it never submits the surrounding form.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  const [visible, setVisible] = useState(false)

  return (
    <Input
      ref={ref}
      type={visible ? 'text' : 'password'}
      rightElement={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          aria-pressed={visible}
          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
        >
          {visible ? <IconEyeOff width={18} height={18} /> : <IconEye width={18} height={18} />}
        </button>
      }
      {...props}
    />
  )
})

PasswordInput.displayName = 'PasswordInput'
