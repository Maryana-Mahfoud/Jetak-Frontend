/**
 * Decides where to send the user after a successful login or register.
 *
 * Both the login page and GuestRoute use this file, so they always
 * agree on the destination and never fight over the redirect.
 */

import { getHomeRouteForRole } from '../config/roleHomeRoutes'
import type { UserRole } from '../config/roles'

/**
 * Reads the `from` path that ProtectedRoute saves in the router location state.
 * Returns null when it is missing or is not a string.
 */
export function getFromPath(state: unknown): string | null {
    if (typeof state !== 'object' || state === null || !('from' in state)) return null
    return typeof state.from === 'string' ? state.from : null
}

// Accepts only paths inside this app (no external URLs, no "//host" tricks).
function isSafeInternalPath(path: string): boolean {
    return path.startsWith('/') && !path.startsWith('//') && !path.includes('\\')
}

// Removes the query string and the hash: "/store/orders?page=2" -> "/store/orders".
function getPathname(path: string): string {
    return path.replace(/[?#].*$/, '')
}

/**
 * Returns the path to open after authentication:
 * - the page the user originally wanted (`from`), but only if it belongs to their role's area;
 * - otherwise, the home page of their role.
 */
export function getPostLoginPath(role: UserRole, from: string | null): string {
    const home = getHomeRouteForRole(role)

    if (from === null || !isSafeInternalPath(from)) return home

    const pathname = getPathname(from)
    const belongsToRole = pathname === home || pathname.startsWith(`${home}/`)

    return belongsToRole ? from : home
}