/**
 * Shared "success popup" flow for the login and register pages.
 *
 * The page wraps its auth request with `runAuthRequest`. This hook then:
 *   1. pauses the redirect of GuestRoute (before the request is sent),
 *   2. runs the request,
 *   3. if the Backend confirmed success: shows the success popup for a short time,
 *      then lets GuestRoute redirect (GuestRoute still decides where to go),
 *   4. if the request failed: resumes the redirect right away and rethrows the
 *      error, so the page keeps showing its normal error message.
 *
 * It must be used by a page rendered inside GuestRoute.
 */

import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { RedirectGateContext } from '../context/RedirectGateContext'

// How long the success popup stays visible before the redirect.
// The checkmark animation takes about 0.9s, so the user sees it complete.
const SUCCESS_DISPLAY_MS = 1400

interface AuthSuccessFlow {
  // True while the success popup should be on screen.
  isSuccessVisible: boolean
  // Runs an auth request (login or register) and handles the popup around it.
  // It returns the request result and rethrows its errors.
  runAuthRequest: <T>(request: () => Promise<T>) => Promise<T>
}

export function useAuthSuccessFlow(): AuthSuccessFlow {
  const gate = useContext(RedirectGateContext)
  if (gate === null) {
    throw new Error('useAuthSuccessFlow must be used inside <GuestRoute>.')
  }
  const { hold, release } = gate

  const [isSuccessVisible, setIsSuccessVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMountedRef = useRef(false)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // When the page goes away (redirect, or the user navigates elsewhere), cancel the
  // pending timer and make sure the redirect is not left on hold.
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      clearTimer()
      release()
    }
  }, [clearTimer, release])

  const runAuthRequest = useCallback(
    async <T>(request: () => Promise<T>): Promise<T> => {
      // The hold must be active BEFORE the request starts: the session becomes
      // authenticated inside the request, and GuestRoute must already be waiting.
      hold()

      let result: T
      try {
        result = await request()
      } catch (error) {
        // Failure: no popup. Resume normal behavior and let the page show the error.
        release()
        throw error
      }

      // The page was closed while the request was running: nothing to show or schedule.
      if (!isMountedRef.current) return result

      setIsSuccessVisible(true)
      clearTimer()
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        // GuestRoute redirects to the right page (same rules as before).
        release()
      }, SUCCESS_DISPLAY_MS)

      return result
    },
    [hold, release, clearTimer],
  )

  return { isSuccessVisible, runAuthRequest }
}