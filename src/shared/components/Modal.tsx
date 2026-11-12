/**
 * Reusable modal dialog (popup) built on the native <dialog> element.
 *
 * The browser provides focus trapping, the Escape key and the dimmed backdrop,
 * so no extra library is needed.
 *
 * Dismissible vs blocking:
 * - Pass `onClose` and the user can close it (Escape, backdrop click, close button).
 * - Omit `onClose` and the modal is blocking: the user must use one of the `actions`
 *   (or, for a modal without actions, it closes only when `open` becomes false).
 *
 * Layout options (all optional, the defaults keep the original look):
 * - size: "md" (default) or the narrower "sm".
 * - align: "start" (default) or "center" for icon, title, text and actions.
 * - iconFramed: draws the soft orange circle around `icon`. Turn it off when the
 *   icon brings its own badge (for example AnimatedCheck).
 */

import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'

type ModalSize = 'sm' | 'md'
type ModalAlign = 'start' | 'center'

interface ModalProps {
  open: boolean
  title: string
  // Optional icon shown above the title.
  icon?: ReactNode
  // The message or content of the modal.
  children?: ReactNode
  // Buttons shown at the bottom (the primary action should come first).
  actions?: ReactNode
  // When provided, the modal is dismissible and this is called after it closes.
  onClose?: () => void
  size?: ModalSize
  align?: ModalAlign
  iconFramed?: boolean
}

// Full class names are written out so Tailwind can find them in the source.
const SIZE_STYLES: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
}

export function Modal({
  open,
  title,
  icon,
  children,
  actions,
  onClose,
  size = 'md',
  align = 'start',
  iconFramed = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const isDismissible = onClose !== undefined
  const isCentered = align === 'center'

  // Keep the native dialog in sync with the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog === null) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      // Escape fires "cancel": block it when the user must choose an action.
      onCancel={(event) => {
        if (!isDismissible) event.preventDefault()
      }}
      // Fires after the dialog has closed (Escape or close button).
      onClose={onClose}
      // The dialog element itself is only clicked when the user clicks the backdrop,
      // because the visible content is inside the inner <div> below.
      onClick={(event) => {
        if (isDismissible && event.target === event.currentTarget) {
          dialogRef.current?.close()
        }
      }}
      // The "starting:" classes are the entry state: the dialog fades in and scales up from 95%.
      className={`m-auto w-[calc(100%-2rem)] ${SIZE_STYLES[size]} rounded-card bg-white p-0 text-jetak-navy shadow-popup transition duration-300 ease-out backdrop:bg-jetak-navy/50 backdrop:backdrop-blur-sm focus-visible:outline-none starting:open:scale-95 starting:open:opacity-0`}
    >
      <div className={`relative p-6 sm:p-8 ${isCentered ? 'text-center' : ''}`}>
        {isDismissible && (
          <button
            type="button"
            aria-label="إغلاق"
            onClick={() => dialogRef.current?.close()}
            className="absolute end-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none text-jetak-navy-light hover:bg-jetak-gray focus-visible:outline-2 focus-visible:outline-jetak-orange"
          >
            ×
          </button>
        )}

        {icon !== undefined &&
          (iconFramed ? (
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-jetak-orange-soft text-jetak-orange ${isCentered ? 'mx-auto' : ''}`}
            >
              {icon}
            </div>
          ) : (
            <div className={`mb-4 flex ${isCentered ? 'justify-center' : ''}`}>{icon}</div>
          ))}

        <h2 id={titleId} className="text-xl font-bold text-jetak-navy">
          {title}
        </h2>

        {children !== undefined && (
          <div className="mt-2 text-sm leading-6 text-jetak-navy-light">{children}</div>
        )}

        {actions !== undefined && (
          <div
            className={`mt-6 flex flex-col-reverse gap-3 sm:flex-row ${isCentered ? 'sm:justify-center' : 'sm:justify-end'}`}
          >
            {actions}
          </div>
        )}
      </div>
    </dialog>
  )
}