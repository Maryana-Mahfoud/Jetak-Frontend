/**
 * TEMPORARY page used to test routing and the role guards before the real
 * dashboards exist. It shows who is logged in and offers a logout button.
 * Delete it once every route has its real page.
 *
 * It lives in the app layer because it reads the auth state: the shared layer
 * must not depend on any feature.
 */

import { useState } from 'react'
import { Button } from '../../shared/components/Button'
import { useAuth } from '../../features/auth/hooks/useAuth'

interface PlaceholderPageProps {
    title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
    const { user, role, logout } = useAuth()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    async function handleLogout(): Promise<void> {
        setIsLoggingOut(true)
        try {
        await logout()
        } finally {
        setIsLoggingOut(false)
        }
    }

    return (
    <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-card bg-white p-8 text-center shadow-soft">
        <h1 className="text-2xl font-bold text-jetak-navy">{title}</h1>
        <p className="mt-2 text-sm text-jetak-navy-light">
            {user?.name} · {role}
        </p>
        <Button
            className="mt-6"
            variant="secondary"
            fullWidth
            isLoading={isLoggingOut}
            onClick={() => void handleLogout()}
            >
            تسجيل الخروج
            </Button>
        </div>
        </main>
    )
}