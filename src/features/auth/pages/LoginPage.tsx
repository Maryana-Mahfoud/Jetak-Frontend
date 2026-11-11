/**
 * Login page: email + password form shown inside AuthLayout.
 *
 * It does not redirect after a successful login. GuestRoute (which wraps this page)
 * notices the new session and sends the user to the right place, so there is
 * a single place that decides the destination.
 */

import { Mail } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { getErrorMessage } from '../../../core/api/getErrorMessage'
import { Button } from '../../../shared/components/Button'
import { PasswordField } from '../../../shared/components/PasswordField'
import { TextField } from '../../../shared/components/TextField'
import { AuthTabs } from '../components/AuthTabs'
import { useAuth } from '../hooks/useAuth'

interface LoginFieldErrors {
    email?: string
    password?: string
    }

// Only checks that the fields are filled in. Real credential checks belong to the Backend.
function validate(email: string, password: string): LoginFieldErrors {
    const errors: LoginFieldErrors = {}
    if (email.trim() === '') errors.email = 'Please enter your email.'
    if (password === '') errors.password = 'Please enter your password.'
    return errors
}

export function LoginPage() {
    const { login } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
    const [formError, setFormError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    // Blocks a second submit while the first request is still running.
    if (isSubmitting) return

    const errors = validate(email, password)
    setFieldErrors(errors)
    setFormError(null)
    if (errors.email !== undefined || errors.password !== undefined) return

    setIsSubmitting(true)
    try {
        await login({ email: email.trim(), password })
        // Success: keep the button in its loading state. GuestRoute redirects
        // right away, so this page disappears.
        } catch (caught) {
        setFormError(getErrorMessage(caught))
        setIsSubmitting(false)
        }
    }

    return (
    <>
        <div className="text-center">
            <h1 className="text-2xl font-bold text-jetak-navy">Welcome back</h1>
            <p className="mt-1 text-sm text-jetak-navy-light">Log in to continue ordering</p>
        </div>

        <div className="mt-6">
            <AuthTabs />
        </div>

      {/* noValidate: we show our own messages instead of the browser's default bubbles. */}
        <form onSubmit={(event) => void handleSubmit(event)} noValidate className="mt-6 space-y-4">
            <TextField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            startIcon={<Mail size={18} />}
            value={email}
            error={fieldErrors.email}
            disabled={isSubmitting}
            onChange={(event) => {
                setEmail(event.target.value)
                setFieldErrors((previous) => ({ ...previous, email: undefined }))
            }}
            />

            <PasswordField
            label="Password"
            name="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            error={fieldErrors.password}
            disabled={isSubmitting}
            onChange={(event) => {
                setPassword(event.target.value)
                setFieldErrors((previous) => ({ ...previous, password: undefined }))
            }}
            />

            {formError !== null && (
            <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
                {formError}
            </p>
            )}

            <Button type="submit" fullWidth isLoading={isSubmitting}>
            Login
            </Button>
        </form>
        </>
    )
}