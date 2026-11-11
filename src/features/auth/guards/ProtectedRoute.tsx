/**
 * Guards a group of routes: only users with an active session can see them.
 *
 * Used as a layout route, so every child route is protected:
 *   <Route element={<ProtectedRoute />}> ...private routes... </Route>
 *
 * This is a UX guard only. Real authorization is enforced by the Laravel Backend.
 */

import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { Button } from '../../../shared/components/Button'
import { FullScreenLoader } from '../../../shared/components/FullScreenLoader'
import { Modal } from '../../../shared/components/Modal'
import { AUTH_ROUTES } from '../config/authRoutes'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
    const { status, error, refreshUser, logout } = useAuth()
    const location = useLocation()
    // Prevents a double click on "Log out" while the request is in flight.
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    async function handleLogout(): Promise<void> {
        setIsLoggingOut(true)
        try {
        await logout()
        } finally {
        setIsLoggingOut(false)
        }
    }

  // Never decide anything while we are still checking the session,
  // otherwise a logged-in user would flash the login page on refresh.
    if (status === 'loading') return <FullScreenLoader />

  // The session could not be verified (network/server problem or unsupported role).
  // The modal has no onClose, so it is blocking: the user must pick an action.
    if (status === 'error') {
        return (
        <div className="min-h-screen">
            <Modal
            open
            title="تعذّر التحقق من الجلسة"
            icon={<TriangleAlert size={24} aria-hidden="true" />}
            actions={
                <>
                <Button onClick={() => void refreshUser()} disabled={isLoggingOut}>
                    إعادة المحاولة
                </Button>
                <Button
                    variant="secondary"
                    isLoading={isLoggingOut}
                    onClick={() => void handleLogout()}
                >
                    تسجيل الخروج
                </Button>
                </>
            }
            >
            {error?.message ?? 'حدث خطأ أثناء التحقق من الجلسة. حاول مرة أخرى.'}
            </Modal>
        </div>
        )
    }

  // Not logged in: go to login and remember where the user wanted to go.
    if (status === 'unauthenticated') {
        const from = `${location.pathname}${location.search}${location.hash}`
        return <Navigate to={AUTH_ROUTES.login} replace state={{ from }} />
    }

    return <Outlet />
}