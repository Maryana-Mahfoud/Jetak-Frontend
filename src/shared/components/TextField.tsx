/**
 * Reusable text input with a label, an optional icon and an error message.
 *
 * Every form field in the app (login, register, profile) uses this component,
 * so labels, focus states and error messages look and behave the same everywhere.
 *
 * Focus effect: the border turns orange, a soft orange halo appears around the field
 * and the start icon turns orange too. All of it is animated by one CSS transition.
 */

import { useId } from 'react'
import type { ComponentProps, ReactNode } from 'react'

// Extends the native <input> props, so type, value, onChange, autoComplete, etc. all work as usual.
interface TextFieldProps extends ComponentProps<'input'> {
  label: string
  // When set, the field is shown in the error style and the message appears below it.
  error?: string
  // Icon shown at the start of the field (decorative, hidden from screen readers).
  startIcon?: ReactNode
  // Interactive element shown at the end of the field (for example a show/hide password button).
  endAdornment?: ReactNode
}

export function TextField({
  label,
  error,
  startIcon,
  endAdornment,
  id,
  // `className` is applied to the outer wrapper (for spacing), not to the <input> itself.
  className = '',
  ...rest
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const hasError = error !== undefined && error !== ''

  const startPadding = startIcon !== undefined ? 'ps-10' : 'ps-4'
  const endPadding = endAdornment !== undefined ? 'pe-12' : 'pe-4'

  // Border and halo depend on the state: error, or normal (hover and focus use the brand orange).
  const borderStyles = hasError
    ? 'border-red-500 focus:ring-4 focus:ring-red-500/15'
    : 'border-jetak-gray enabled:hover:border-jetak-orange/40 focus:border-jetak-orange focus:ring-4 focus:ring-jetak-orange/15'

  // The icon follows the focus of the field: orange while typing, red when there is an error.
  const iconColor = hasError
    ? 'text-red-500'
    : 'text-jetak-navy-light group-focus-within/field:text-jetak-orange'

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-jetak-navy">
        {label}
      </label>

      {/* "group/field" lets the icon react when the input (or the end button) has focus. */}
      <div className="group/field relative">
        {startIcon !== undefined && (
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 start-3 flex items-center transition-colors duration-200 ${iconColor}`}
          >
            {startIcon}
          </span>
        )}

        <input
          {...rest}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`w-full rounded-xl border bg-white py-3 text-sm text-jetak-navy transition duration-200 ease-out placeholder:text-jetak-navy-light/60 focus:outline-none disabled:cursor-not-allowed disabled:bg-jetak-gray-soft disabled:opacity-60 ${startPadding} ${endPadding} ${borderStyles}`}
        />

        {endAdornment !== undefined && (
          <div className="absolute inset-y-0 end-2 flex items-center">{endAdornment}</div>
        )}
      </div>

      {/* The message slides in when the error appears (the element only exists while there is an error). */}
      {hasError && (
        <p id={errorId} className="animate-fade-up mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}