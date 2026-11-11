/**
 * The only way components should read the authentication state.
 *
 * Usage: const { user, role, status, login, logout } = useAuth()
 */

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import type { AuthContextValue } from '../context/AuthContext'

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext)

    // The context is null only when there is no AuthProvider above this component.
    if (context === null) {
        throw new Error('useAuth must be used inside <AuthProvider>.')
    }

    return context
}