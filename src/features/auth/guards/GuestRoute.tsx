/**
 * Guards public-only routes (login, register).
 *
 * A logged-in user has no reason to see these pages, so they are sent to the
 * page they originally wanted or to the home page of their role.
 * The destination comes from getPostLoginPath, the same function used everywhere,
 * so the rules live in one place.
 *
 * A page can ask this guard to wait before redirecting (see RedirectGateContext).
 * The login/register pages use that to show the success popup first. While the
 * redirect is on hold the page stays mounted, so its own state is not lost.
 */

import { useCallback, useMemo, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { FullScreenLoader } from '../../../shared/components/FullScreenLoader'
import { RedirectGateContext } from '../context/RedirectGateContext'
import type { RedirectGate } from '../context/RedirectGateContext'
import { useAuth } from '../hooks/useAuth'
import { getFromPath, getPostLoginPath } from '../utils/redirect'

export function GuestRoute() {
  const { status, role } = useAuth()
  const location = useLocation()
  const [isHeld, setIsHeld] = useState(false)

  // Stable functions and value, so pages that use the gate do not re-run effects on every render.
  const hold = useCallback(() => setIsHeld(true), [])
  const release = useCallback(() => setIsHeld(false), [])
  const gate = useMemo<RedirectGate>(() => ({ hold, release }), [hold, release])

  // Hooks above must always run, so the early returns come after them.
  if (status === 'loading') return <FullScreenLoader />

  if (status === 'authenticated' && role !== null && !isHeld) {
    return <Navigate to={getPostLoginPath(role, getFromPath(location.state))} replace />
  }

  // "unauthenticated" and "error" both show the public page: after a failed
  // session check the user can simply log in again.
  // The page also renders here while the redirect is on hold (authenticated + held).
  // Both cases return the same element tree, so React keeps the page mounted.
  return (
    <RedirectGateContext value={gate}>
      <Outlet />
    </RedirectGateContext>
  )
}