/**
 * Reusable button used across the whole app so every button looks
 * and behaves the same (hover, pressed, focus, disabled and loading states).
 *
 * Every interaction effect uses the "enabled:" prefix, so a disabled or loading
 * button (which is disabled while loading) stays completely still.
 */

import type { ComponentProps } from 'react'

type ButtonVariant = 'primary' | 'secondary'

// Extends the native <button> props, so onClick, type, disabled, etc. all work as usual.
interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  // Shows a spinner and blocks clicks (prevents double submit on financial or form actions).
  isLoading?: boolean
  fullWidth?: boolean
}

// "transition" animates colors, shadow, filter and transform together.
// Pressed effect: the button shrinks slightly while it is held down (mouse or touch).
const BASE_STYLES =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jetak-orange disabled:cursor-not-allowed disabled:opacity-60 enabled:active:scale-[0.98]'

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  // Orange gradient from the reference design. Gradients cannot be transitioned
  // between colors, so hover darkens the whole button with brightness instead.
  // Hover also lifts the button 2px and adds a soft orange glow; pressing puts it back down.
  // (Tailwind applies hover: only on devices that really support hover, not on touch screens.)
  primary:
    'bg-linear-to-br from-jetak-orange to-jetak-orange-dark text-white shadow-soft enabled:hover:-translate-y-0.5 enabled:hover:shadow-lg enabled:hover:shadow-jetak-orange/35 enabled:hover:brightness-95 enabled:active:translate-y-0',
  secondary:
    'border border-jetak-gray bg-white text-jetak-navy enabled:hover:border-jetak-orange/40 enabled:hover:bg-jetak-gray-soft',
}

export function Button({
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  // Default to "button" so a button inside a form never submits it by accident.
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`${BASE_STYLES} ${VARIANT_STYLES[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  )
}