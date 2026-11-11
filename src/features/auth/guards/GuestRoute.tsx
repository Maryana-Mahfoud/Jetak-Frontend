/**
 * Guards public-only routes (login, register).
 *
 * A logged-in user has no reason to see these pages, so they are sent to the
 * page they originally wanted or to the home page of their role.
 * The destination comes from getPostLoginPath, the same function the login page
 * uses, so the two never disagree.
 */

import { Navigate, Outlet, useLocation } from 'react-router'
import { FullScreenLoader } from '../../../shared/components/FullScreenLoader'
import { useAuth } from '../hooks/useAuth'
import { getFromPath, getPostLoginPath } from '../utils/redirect'

export function GuestRoute() {
    const { status, role } = useAuth()
    const location = useLocation()

    if (status === 'loading') return <FullScreenLoader />

    if (status === 'authenticated' && role !== null) {
        return <Navigate to={getPostLoginPath(role, getFromPath(location.state))} replace />
    }

  // "unauthenticated" and "error" both show the public page:
  // after a failed session check the user can simply log in again.
    return <Outlet />
}