/**
 * Full-screen loading indicator.
 *
 * Used by the route guards while the session is being checked, so the same
 * loading screen appears everywhere instead of being repeated in each guard.
 */

interface FullScreenLoaderProps {
  // Text read by screen readers (it is not shown on screen).
    label?: string
}

export function FullScreenLoader({ label = 'جارٍ التحميل...' }: FullScreenLoaderProps) {
    return (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-live="polite">
        <span
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border-4 border-jetak-gray border-t-jetak-orange"
        />
        <span className="sr-only">{label}</span>
    </div>
    )
}