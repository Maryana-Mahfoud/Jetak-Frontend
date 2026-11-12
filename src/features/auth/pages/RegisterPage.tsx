/**
 * Register page: a two-step form shown inside AuthLayout.
 *
 * Step 1 collects the account details, step 2 the delivery address.
 * Nothing is sent between the steps: one register request is sent at the end.
 * Like the login page, it does not redirect by itself. After a successful
 * registration it shows the success popup (useAuthSuccessFlow), then GuestRoute
 * notices the new session and sends the user to the right place.
 */

import { Building2, DoorOpen, Layers, Mail, Phone, User } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { getErrorMessage } from '../../../core/api/getErrorMessage'
import { Button } from '../../../shared/components/Button'
import { PasswordField } from '../../../shared/components/PasswordField'
import { TextField } from '../../../shared/components/TextField'
import { AuthSuccessModal } from '../components/AuthSuccessModal'
import { AuthTabs } from '../components/AuthTabs'
import { useAuth } from '../hooks/useAuth'
import { useAuthSuccessFlow } from '../hooks/useAuthSuccessFlow'
import {
  INITIAL_REGISTER_VALUES,
  hasErrors,
  toRegisterRequest,
  validateAccountStep,
  validateAddressStep,
} from '../utils/registerValidation'
import type { RegisterFormErrors, RegisterFormValues } from '../utils/registerValidation'

type Step = 1 | 2

const TOTAL_STEPS = 2

const SUBTITLES: Record<Step, string> = {
  1: 'Join us and start ordering in seconds',
  2: 'Where should we deliver your orders?',
}

export function RegisterPage() {
  const { register } = useAuth()
  const { isSuccessVisible, runAuthRequest } = useAuthSuccessFlow()

  const [step, setStep] = useState<Step>(1)
  // Values live at page level, so going back to step 1 keeps what was typed.
  const [values, setValues] = useState<RegisterFormValues>(INITIAL_REGISTER_VALUES)
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Updates one field and clears its error as soon as the user edits it.
  function updateField(field: keyof RegisterFormValues, value: string): void {
    setValues((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: undefined }))
  }

  function goBack(): void {
    setErrors({})
    setFormError(null)
    setStep(1)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    // Blocks a second submit while the request or the success popup is active.
    if (isSubmitting) return
    setFormError(null)

    if (step === 1) {
      const stepErrors = validateAccountStep(values)
      setErrors(stepErrors)
      if (!hasErrors(stepErrors)) setStep(2)
      return
    }

    const stepErrors = validateAddressStep(values)
    setErrors(stepErrors)
    if (hasErrors(stepErrors)) return

    setIsSubmitting(true)
    try {
      await runAuthRequest(() => register(toRegisterRequest(values)))
      // Success: the popup is now visible. Keep the loading state;
      // the page disappears when GuestRoute redirects.
    } catch (caught) {
      // A Backend rejection (for example "email already taken") may belong to step 1,
      // so the Back button stays available next to this message.
      setFormError(getErrorMessage(caught))
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-jetak-navy">Create account</h1>
        <p className="mt-1 text-sm text-jetak-navy-light">{SUBTITLES[step]}</p>
      </div>

      <div className="mt-6">
        <AuthTabs />
      </div>

      {/* Progress: purely informational, so it is one image for screen readers. */}
      <div
        role="img"
        aria-label={`Step ${step} of ${TOTAL_STEPS}`}
        className="mt-6 flex items-center gap-2"
      >
        {[1, 2].map((number) => (
          <span
            key={number}
            className={`h-1.5 flex-1 rounded-full transition ${
              number <= step ? 'bg-jetak-orange' : 'bg-jetak-gray'
            }`}
          />
        ))}
      </div>

      {/* noValidate: we show our own messages instead of the browser's default bubbles. */}
      <form onSubmit={(event) => void handleSubmit(event)} noValidate className="mt-6 space-y-4">
        {step === 1 && (
          <>
            <TextField
              label="Full name"
              name="name"
              autoComplete="name"
              placeholder="Full name"
              startIcon={<User size={18} />}
              value={values.name}
              error={errors.name}
              onChange={(event) => updateField('name', event.target.value)}
            />
            <TextField
              label="Phone number"
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              placeholder="Phone number"
              startIcon={<Phone size={18} />}
              value={values.phone}
              error={errors.phone}
              onChange={(event) => updateField('phone', event.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              startIcon={<Mail size={18} />}
              value={values.email}
              error={errors.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
            <PasswordField
              label="Password"
              name="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={values.password}
              error={errors.password}
              onChange={(event) => updateField('password', event.target.value)}
            />

            <Button type="submit" fullWidth>
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            {/* Numeric fields: digits only. Text type avoids the browser's spinner arrows. */}
            <TextField
              label="Building number"
              name="building_number"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Building number"
              autoFocus
              startIcon={<Building2 size={18} />}
              value={values.building_number}
              error={errors.building_number}
              disabled={isSubmitting}
              onChange={(event) =>
                updateField('building_number', event.target.value.replace(/\D/g, ''))
              }
            />
            <TextField
              label="Floor"
              name="floor"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Floor"
              startIcon={<Layers size={18} />}
              value={values.floor}
              error={errors.floor}
              disabled={isSubmitting}
              onChange={(event) => updateField('floor', event.target.value.replace(/\D/g, ''))}
            />
            <TextField
              label="Room number"
              name="room_number"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Room number"
              startIcon={<DoorOpen size={18} />}
              value={values.room_number}
              error={errors.room_number}
              disabled={isSubmitting}
              onChange={(event) =>
                updateField('room_number', event.target.value.replace(/\D/g, ''))
              }
            />

            {formError !== null && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {formError}
              </p>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" onClick={goBack} disabled={isSubmitting}>
                Back
              </Button>
              <Button type="submit" className="flex-1" isLoading={isSubmitting}>
                Create account
              </Button>
            </div>
          </>
        )}
      </form>

      <AuthSuccessModal open={isSuccessVisible} variant="register" />
    </>
  )
}