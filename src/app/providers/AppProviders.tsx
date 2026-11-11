/**
 * Composes every global provider in one place.
 *
 * The root of the app wraps the whole tree with this component, so adding a
 * future provider (for example notifications) means editing this file only.
 */

import type { ReactNode } from 'react'
import { AuthProvider } from '../../features/auth/context/AuthProvider'

interface AppProvidersProps {
    children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
    return <AuthProvider>{children}</AuthProvider>
}