/**
 * Maps each role to its home route (where the user lands after login).
 *
 * These paths are our own front-end design, not defined by the Backend.
 * To change a path, edit it here only.
 */

import { ROLES } from './roles'
import type { UserRole } from './roles'

// Typed as Record<UserRole, string>: adding a role to ROLES without adding
// its home route here is a compile error, so no role is ever left without a landing page.
const ROLE_HOME_ROUTES: Record<UserRole, string> = {
    [ROLES.student]: '/student',
    [ROLES.deliveryRepresentative]: '/delivery',
    [ROLES.storeAdmin]: '/store',
    [ROLES.hallAdmin]: '/halls',
    [ROLES.superAdmin]: '/admin',
}

// Returns the home route for a role.
export function getHomeRouteForRole(role: UserRole): string {
    return ROLE_HOME_ROUTES[role]
}