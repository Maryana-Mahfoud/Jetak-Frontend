/**
 * Success popup shown after a successful login or registration.
 *
 * It only renders what it is told: the page decides WHEN to show it
 * (after the Backend confirmed success), and useAuthSuccessFlow decides
 * when to continue to the next page. This component has no logic of its own.
 *
 * It has no buttons and no `onClose`, so the user cannot dismiss it or
 * trigger another request while it is visible.
 */

import { AnimatedCheck } from '../../../shared/components/AnimatedCheck'
import { Modal } from '../../../shared/components/Modal'

export type AuthSuccessVariant = 'login' | 'register'

interface AuthSuccessModalProps {
  open: boolean
  variant: AuthSuccessVariant
}

const MESSAGES: Record<AuthSuccessVariant, { title: string; message: string }> = {
  login: {
    title: 'Welcome Back!',
    message: 'You have successfully logged in.',
  },
  register: {
    title: 'Account Created Successfully!',
    message: 'Your account is ready.',
  },
}

export function AuthSuccessModal({ open, variant }: AuthSuccessModalProps) {
  const { title, message } = MESSAGES[variant]

  return (
    <Modal
      open={open}
      title={title}
      icon={<AnimatedCheck />}
      // The checkmark brings its own green badge, so no orange frame around it.
      iconFramed={false}
      size="sm"
      align="center"
    >
      <p>{message}</p>

      {/* A small orange spinner tells the user the next page is about to open. */}
      <p className="mt-4 flex items-center justify-center gap-2 text-xs font-medium">
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-jetak-orange border-t-transparent"
        />
        Redirecting…
      </p>
    </Modal>
  )
}