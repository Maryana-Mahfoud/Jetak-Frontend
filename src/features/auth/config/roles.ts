/**
 * Single source of truth for user roles.
 *
 * Each value is the exact string returned by the Backend in `user.role`.
 * To support a new role: add it here, then add its home route and guards.
 */

export const ROLES = {
  student: 'Student',
  // The Backend role name is 'Delivery' (not 'Delivery Representative').
  deliveryRepresentative: 'Delivery',
  storeAdmin: 'Store Admin',
  hallAdmin: 'Hall Admin',
  superAdmin: 'Super Admin',
} as const

// Union of the role strings above: 'Student' | 'Delivery' | ...
export type UserRole = (typeof ROLES)[keyof typeof ROLES]

const KNOWN_ROLES: readonly string[] = Object.values(ROLES)

// Checks at runtime that a value from the Backend is a role this app supports.
export function isKnownRole(value: unknown): value is UserRole {
  return typeof value === 'string' && KNOWN_ROLES.includes(value)
}

// Returns true when the user's role is one of the allowed roles.
// Kept as a function so a future change (for example multiple roles) touches one place only.
export function hasRole(role: UserRole | null, allowedRoles: readonly UserRole[]): boolean {
  return role !== null && allowedRoles.includes(role)
}