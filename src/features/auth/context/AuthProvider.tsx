/**
 * Owns the authentication session and exposes it through AuthContext.
 *
 * Responsibilities:
 * - restore the session on page load (token in storage -> GET /me)
 * - login, register, logout
 * - reset the session when the Backend rejects our token (401)
 *
 * The token itself is never kept in React state: it lives in tokenStorage only.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { setUnauthorizedHandler } from '../../../core/api/apiClient'
import { ApiError } from '../../../core/api/apiError'
import { tokenStorage } from '../../../core/storage/tokenStorage'
import { authService } from '../api/authService'
import type { AuthStatus, AuthUser, LoginRequest, RegisterRequest } from '../types/auth.types'
import { AuthContext } from './AuthContext'
import type { AuthContextValue } from './AuthContext'

// The whole session in one object so impossible combinations cannot exist.
interface SessionState {
    status: AuthStatus
    user: AuthUser | null
    error: ApiError | null
}

const UNAUTHENTICATED: SessionState = { status: 'unauthenticated', user: null, error: null }
const LOADING: SessionState = { status: 'loading', user: null, error: null }

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Start in "loading" only when there is a token that must be checked with /me.
    const [session, setSession] = useState<SessionState>(() =>
        tokenStorage.getToken() !== null ? LOADING : UNAUTHENTICATED,
    )

  /**
   * Fetches /me and updates the session.
   * - 401: apiClient already cleared the token and called our unauthorized handler.
   * - Other failures: if we already have a user (for example a refresh after a profile
   *   update) we keep it; otherwise the session goes to "error" so the UI can offer a retry.
   */
    const loadCurrentUser = useCallback(async (signal?: AbortSignal): Promise<void> => {
    try {
        const user = await authService.getCurrentUser(signal)
        setSession({ status: 'authenticated', user, error: null })
    } catch (caught) {
      // The request was cancelled on purpose (component unmounted): do nothing.
        if (signal?.aborted) return

        if (caught instanceof ApiError) {
            if (caught.kind === 'unauthorized') return
            setSession((previous) =>
            previous.user !== null ? previous : { status: 'error', user: null, error: caught },
        )
        return
        }

        const unexpected = new ApiError({
        kind: 'unknown',
        status: null,
        message: 'حدث خطأ غير متوقع.',
        })
        setSession((previous) =>
        previous.user !== null ? previous : { status: 'error', user: null, error: unexpected },
        )
    }
    }, [])

  // Register the 401 handler. It is declared before the restore effect so it is
  // already in place when the first /me request starts.
    useEffect(() => {
        setUnauthorizedHandler(() => setSession(UNAUTHENTICATED))
        return () => setUnauthorizedHandler(null)
    }, [])

  // Restore the session after a page load or refresh.
    useEffect(() => {
        if (tokenStorage.getToken() === null) return

        const controller = new AbortController()
        void loadCurrentUser(controller.signal)
        return () => controller.abort()
    }, [loadCurrentUser])

    const login = useCallback(async (credentials: LoginRequest): Promise<AuthUser> => {
        const { user, token } = await authService.login(credentials)
        tokenStorage.setToken(token)
        setSession({ status: 'authenticated', user, error: null })
        return user
    }, [])

    const register = useCallback(async (data: RegisterRequest): Promise<AuthUser> => {
    const { token } = await authService.register(data)
    tokenStorage.setToken(token)

    // The register response has no `role`, so the user is loaded from /me.
        try {
        const user = await authService.getCurrentUser()
        setSession({ status: 'authenticated', user, error: null })
        return user
    } catch (caught) {
      // Do not leave a half-finished session behind: the user can log in instead.
        tokenStorage.clearToken()
        setSession(UNAUTHENTICATED)
        throw caught
    }
    }, [])

    const logout = useCallback(async (): Promise<void> => {
    try {
      // The token must still be in storage here so the request is authenticated.
        await authService.logout()
    } catch {
      // The local session is cleared below whether or not the Backend call worked.
    }
    tokenStorage.clearToken()
    setSession(UNAUTHENTICATED)
    }, [])

    const refreshUser = useCallback(async (): Promise<void> => {
    // After an error, show the loading state again while retrying.
    setSession((previous) => (previous.status === 'error' ? LOADING : previous))
    await loadCurrentUser()
    }, [loadCurrentUser])

    const value = useMemo<AuthContextValue>(
    () => ({
        status: session.status,
        user: session.user,
        role: session.user?.role ?? null,
        error: session.error,
        login,
        register,
        logout,
        refreshUser,
        }),
    [session, login, register, logout, refreshUser],
    )

    return <AuthContext value={value}>{children}</AuthContext>
}