/**
 * Defines the shape of the authentication context and creates it.
 *
 * This file contains no logic: AuthProvider fills the context and
 * the useAuth hook reads it. Components should never import AuthContext directly.
 */

import { createContext } from 'react'
import type { ApiError } from '../../../core/api/apiError'
import type { UserRole } from '../config/roles'
import type { AuthStatus, AuthUser, LoginRequest, RegisterRequest } from '../types/auth.types'

export interface AuthContextValue {
  // Where the session is right now: loading, authenticated, unauthenticated or error.
  status: AuthStatus
  // The current user, or null when nobody is logged in.
  user: AuthUser | null
  // Derived from `user` for convenience (null when there is no user).
  role: UserRole | null
  // Set only when status is 'error' (session check failed because of network or server problems).
  error: ApiError | null

  // Both throw an ApiError on failure so the calling form can show the message.
  login: (credentials: LoginRequest) => Promise<AuthUser>
  register: (data: RegisterRequest) => Promise<AuthUser>

  // Always clears the local session, even if the Backend request fails.
  logout: () => Promise<void>

  // Fetches /me again: used to retry after an 'error' status and to refresh the user after a profile update.
  refreshUser: () => Promise<void>
}

// The default is null so useAuth can detect usage outside of AuthProvider.
export const AuthContext = createContext<AuthContextValue | null>(null)