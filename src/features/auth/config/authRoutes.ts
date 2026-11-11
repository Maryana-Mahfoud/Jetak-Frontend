/**
 * Public route paths of the authentication feature, defined in one place.
 *
 * Guards and pages import these constants instead of repeating the strings,
 * so renaming a path means editing this file only.
 */

export const AUTH_ROUTES = {
    login: '/login',
    register: '/register',
} as const