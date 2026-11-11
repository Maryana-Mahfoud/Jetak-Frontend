/**
 * Password input with a show/hide toggle.
 *
 * It wraps TextField, so it keeps the same label, icon and error behavior.
 * It controls `type` itself, so callers cannot pass it.
 *
 * Callers should set `autoComplete` ("current-password" on login,
 * "new-password" on register) so password managers behave correctly.
 */

import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'
import type { ComponentProps } from 'react'
import { TextField } from './TextField'

// Same props as TextField, except the ones this component controls.
type PasswordFieldProps = Omit<ComponentProps<typeof TextField>, 'type' | 'endAdornment'>

export function PasswordField({ startIcon, ...rest }: PasswordFieldProps) {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <TextField
        {...rest}
        type={isVisible ? 'text' : 'password'}
        // A lock icon by default; callers can pass their own.
        startIcon={startIcon ?? <Lock size={18} />}
        endAdornment={
            <button
            type="button"
            onClick={() => setIsVisible((previous) => !previous)}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isVisible}
            className="flex h-8 w-8 items-center justify-center rounded-full text-jetak-navy-light hover:bg-jetak-gray-soft focus-visible:outline-2 focus-visible:outline-jetak-orange"
            >
            {isVisible ? (
                <EyeOff size={18} aria-hidden="true" />
            ) : (
                <Eye size={18} aria-hidden="true" />
            )}
            </button>
        }
        />
    )
}