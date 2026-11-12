/**
 * Decides when the splash screen is shown, how long it stays and when the app appears.
 *
 * It sits INSIDE AuthProvider (it reads the session status) and ABOVE the router:
 *
 *   <AppProviders>
 *     <SplashGate>
 *       <AppRouter />
 *     </SplashGate>
 *   </AppProviders>
 *
 * Its state lives in memory, in a component that is mounted once, so the splash
 * appears once per page load. Internal navigation and route changes never bring it back.
 *
 * Flow:
 *   showing -> the splash is visible and the router is NOT mounted yet.
 *              Auth restores the session (/me) in the background meanwhile.
 *   leaving -> the splash fades out while the app mounts underneath it.
 *   done    -> the splash is removed.
 *
 * The splash leaves when the minimum time passed AND the session check finished.
 * A maximum time protects the user from a splash that never ends (for example if
 * the server does not answer): after it the route guards show their own loading screen.
 */

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { SplashScreen } from './SplashScreen'

// The splash stays at least this long, so the entrance animation is fully seen.
const SPLASH_MIN_MS = 1600
// Never keep the user on the splash longer than this.
const SPLASH_MAX_MS = 4000
// Must match the fade-out duration (--animate-fade-out in index.css: 0.4s).
const FADE_OUT_MS = 400

type SplashPhase = 'showing' | 'leaving' | 'done'

interface SplashGateProps {
  children: ReactNode
}

export function SplashGate({ children }: SplashGateProps) {
  const { status } = useAuth()

  const [phase, setPhase] = useState<SplashPhase>('showing')
  const [hasMinTimePassed, setHasMinTimePassed] = useState(false)
  const [hasMaxTimePassed, setHasMaxTimePassed] = useState(false)

  // The two timers start once, when the app opens. Both are cleared if the component goes away.
  useEffect(() => {
    const minTimer = setTimeout(() => setHasMinTimePassed(true), SPLASH_MIN_MS)
    const maxTimer = setTimeout(() => setHasMaxTimePassed(true), SPLASH_MAX_MS)

    return () => {
      clearTimeout(minTimer)
      clearTimeout(maxTimer)
    }
  }, [])

  // Ready when the minimum time passed and the session check is over (any result
  // except "loading": authenticated, unauthenticated or error), or when the maximum time passed.
  const isReadyToLeave = hasMaxTimePassed || (hasMinTimePassed && status !== 'loading')

  // One-way switch, adjusted during render (the pattern React recommends for state that
  // depends on other state). It never goes back to "showing", even if the session status
  // changes later (for example a retry after an error), so the app cannot unmount.
  if (phase === 'showing' && isReadyToLeave) {
    setPhase('leaving')
  }

  // After the fade-out has finished, remove the splash.
  useEffect(() => {
    if (phase !== 'leaving') return

    const timer = setTimeout(() => setPhase('done'), FADE_OUT_MS)
    return () => clearTimeout(timer)
  }, [phase])

  // Children keep the same position in this fragment when the splash is removed,
  // so React does not remount the app at that moment.
  return (
    <>
      {phase !== 'showing' && children}
      {phase !== 'done' && <SplashScreen isLeaving={phase === 'leaving'} />}
    </>
  )
}