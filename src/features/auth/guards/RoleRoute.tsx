/**
 * Guards a group of routes by role.
 *
 * It must be nested INSIDE ProtectedRoute, which already guarantees a session:
 *   <Route element={<ProtectedRoute />}>
 *     <Route element={<RoleRoute allowedRoles={[ROLES.student]} />}>
 *       ...student pages...
 *     </Route>
 *   </Route>
 *
 * This is a UX guard only. Real authorization is enforced by the Laravel Backend.
 */

import { Outlet } from 'react-router'
import { hasRole } from '../config/roles'
import type { UserRole } from '../config/roles'
import { useAuth } from '../hooks/useAuth'
import { ForbiddenPage } from '../pages/ForbiddenPage'

interface RoleRouteProps {
  // Every route has to list its allowed roles explicitly:
  // no role (not even Super Admin) gets access to everything by default.
    allowedRoles: readonly UserRole[]
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
    const { role } = useAuth()

    if (!hasRole(role, allowedRoles)) return <ForbiddenPage />

    return <Outlet />
}