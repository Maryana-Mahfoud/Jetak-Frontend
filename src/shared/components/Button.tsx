/**
 * Reusable button used across the whole app so every button looks
 * and behaves the same (hover, focus, disabled and loading states).
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

const BASE_STYLES =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jetak-orange disabled:cursor-not-allowed disabled:opacity-60'

    const VARIANT_STYLES: Record<ButtonVariant, string> = {
    // Orange gradient from the reference design. Gradients cannot be transitioned
    // between colors, so the hover state darkens the whole button with brightness.
    primary:
        'bg-linear-to-br from-jetak-orange to-jetak-orange-dark text-white shadow-soft enabled:hover:brightness-95',
    secondary:
        'border border-jetak-gray bg-white text-jetak-navy enabled:hover:bg-jetak-gray-soft',
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