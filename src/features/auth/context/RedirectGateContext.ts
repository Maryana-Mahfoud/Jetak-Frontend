/**
 * A tiny "pause" switch between a public page and GuestRoute.
 *
 * Normally GuestRoute redirects a logged-in user away from the login/register pages
 * the moment the session becomes authenticated. A page that wants to show something
 * first (the success popup) asks GuestRoute to wait with `hold`, and lets it continue
 * with `release`. GuestRoute still decides WHERE to go: this file only controls WHEN.
 *
 * This file only defines the shape and creates the context (no logic), the same
 * pattern as AuthContext. GuestRoute provides it, useAuthSuccessFlow uses it.
 */

import { createContext } from 'react'

export interface RedirectGate {
  // Pauses the redirect. Must be called BEFORE sending the auth request,
  // so the pause is already active when the session changes.
  hold: () => void
  // Lets GuestRoute redirect again (immediately, if the user is already authenticated).
  release: () => void
}

// The default is null so the code that uses it can detect a page rendered outside GuestRoute.
export const RedirectGateContext = createContext<RedirectGate | null>(null)