/**
 * Shown when a logged-in user opens a page that does not belong to their role (403).
 * It is a screen, not a route: RoleRoute renders it in place of the requested page.
 */

import { ShieldAlert } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '../../../shared/components/Button'
import { AUTH_ROUTES } from '../config/authRoutes'
import { getHomeRouteForRole } from '../config/roleHomeRoutes'
import { useAuth } from '../hooks/useAuth'

export function ForbiddenPage() {
    const { role } = useAuth()
    const navigate = useNavigate()

    const homePath = role !== null ? getHomeRouteForRole(role) : AUTH_ROUTES.login

    return (
    <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-card bg-white p-8 text-center shadow-soft">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-jetak-orange-soft text-jetak-orange">
            <ShieldAlert size={28} aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-jetak-navy">ليس لديك صلاحية</h1>
            <p className="mt-2 text-sm leading-6 text-jetak-navy-light">
            هذه الصفحة غير متاحة لحسابك. يمكنك العودة إلى صفحتك الرئيسية.
            </p>
            <Button
            className="mt-6"
            fullWidth
            onClick={() => void navigate(homePath, { replace: true })}
            >
            العودة إلى صفحتي الرئيسية
            </Button>
        </div>
    </main>
    )
}