/**
 * The route map of the whole app: every path and the page it shows.
 *
 * Guards are nested layout routes, from the outside in:
 *   GuestRoute    -> public pages only (login, register)
 *   ProtectedRoute -> requires a session
 *     RoleRoute   -> requires one of the allowed roles
 *
 * Some pages are TEMPORARY placeholders (marked below) until the real ones are built.
 */

import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router'
import { AuthLayout } from '../../features/auth/components/AuthLayout'
import { AUTH_ROUTES } from '../../features/auth/config/authRoutes'
import { getHomeRouteForRole } from '../../features/auth/config/roleHomeRoutes'
import { ROLES } from '../../features/auth/config/roles'
import { GuestRoute } from '../../features/auth/guards/GuestRoute'
import { ProtectedRoute } from '../../features/auth/guards/ProtectedRoute'
import { RoleRoute } from '../../features/auth/guards/RoleRoute'
import { LoginPage } from '../../features/auth/pages/LoginPage'
import { RegisterPage } from '../../features/auth/pages/RegisterPage'
import { PlaceholderPage } from './PlaceholderPage'

// One entry per role: its home area and the temporary page shown there.
const ROLE_AREAS = [
    { role: ROLES.student, title: 'Student Dashboard' },
    { role: ROLES.deliveryRepresentative, title: 'Delivery Dashboard' },
    { role: ROLES.storeAdmin, title: 'Store Admin Dashboard' },
    { role: ROLES.hallAdmin, title: 'Hall Admin Dashboard' },
    { role: ROLES.superAdmin, title: 'System Dashboard' },
    ] as const

// TEMPORARY: a minimal 404 until we design the real one.
function NotFoundPlaceholder() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-2xl font-bold text-jetak-navy">Page not found</h1>
        <Link to="/" className="font-semibold text-jetak-orange hover:underline">
            Go to the home page
        </Link>
        </main>
    )
    }

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* "/" goes to login. If the user is already logged in, GuestRoute forwards them to their home. */}
                <Route path="/" element={<Navigate to={AUTH_ROUTES.login} replace />} />

                {/* Public pages */}
                <Route element={<GuestRoute />}>
                <Route element={<AuthLayout />}>
                    <Route path={AUTH_ROUTES.login} element={<LoginPage />} />
                    <Route path={AUTH_ROUTES.register} element={<RegisterPage />} />
                </Route>
                </Route>

                {/* Pages that require a session, grouped by role */}
                <Route element={<ProtectedRoute />}>
                {ROLE_AREAS.map(({ role, title }) => (
                    <Route key={role} element={<RoleRoute allowedRoles={[role]} />}>
                    {/* "/*" so future sub-pages (for example /store/products) are covered too. */}
                    <Route
                        path={`${getHomeRouteForRole(role)}/*`}
                        element={<PlaceholderPage title={title} />}
                    />
                    </Route>
                ))}
                </Route>

                <Route path="*" element={<NotFoundPlaceholder />} />
            </Routes>
        </BrowserRouter>
    )
}