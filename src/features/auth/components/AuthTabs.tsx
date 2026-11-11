/**
 * Register | Login switcher shown at the top of both auth pages.
 *
 * The two tabs are real links (not local state), so the browser URL always
 * matches the page that is open and the back button works as expected.
 */

import { LogIn, UserPlus } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import { AUTH_ROUTES } from '../config/authRoutes'

const TABS = [
    { to: AUTH_ROUTES.register, label: 'Register', Icon: UserPlus },
    { to: AUTH_ROUTES.login, label: 'Login', Icon: LogIn },
] as const

const BASE_STYLES =
    'flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jetak-orange'

const ACTIVE_STYLES =
    'bg-linear-to-br from-jetak-orange to-jetak-orange-dark text-white shadow-soft'

const INACTIVE_STYLES = 'text-jetak-navy-light hover:text-jetak-navy'

export function AuthTabs() {
    const location = useLocation()

    return (
        <nav aria-label="Authentication" className="flex gap-1 rounded-2xl bg-jetak-orange-soft p-1">
        {TABS.map(({ to, label, Icon }) => (
            <NavLink
            key={to}
            to={to}
            // Keep the router state so the "from" page saved by ProtectedRoute
            // is not lost when the user switches between the two tabs.
            state={location.state}
            className={({ isActive }) =>
                `${BASE_STYLES} ${isActive ? ACTIVE_STYLES : INACTIVE_STYLES}`
            }
            >
            <Icon size={16} aria-hidden="true" />
            {label}
            </NavLink>
        ))}
        </nav>
    )
}