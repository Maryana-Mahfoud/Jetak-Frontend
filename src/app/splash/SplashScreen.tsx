/**
 * Welcome screen shown when the app is opened.
 *
 * It is purely visual: no timers and no knowledge of authentication.
 * SplashGate decides how long it stays and when `isLeaving` becomes true.
 *
 * Motion (CSS only, defined in index.css):
 * - the project name fades in,
 * - the tagline scales in slightly, a little after the name,
 * - when `isLeaving` is true the whole screen fades out.
 */

import { Package, ShoppingBag, Truck } from 'lucide-react'

interface SplashScreenProps {
  // When true, the screen fades out. The parent removes it after the fade ends.
  isLeaving: boolean
}

export function SplashScreen({ isLeaving }: SplashScreenProps) {
  return (
    <div
      role="status"
      // Covers the whole app. While leaving it must not block clicks on the page underneath.
      className={`fixed inset-0 z-50 flex h-dvh items-center justify-center overflow-hidden bg-linear-to-br from-jetak-orange to-jetak-orange-dark ${
        isLeaving ? 'animate-fade-out pointer-events-none' : ''
      }`}
    >
      {/* Screen readers get a short text; the visible brand below is decorative for them. */}
      <span className="sr-only">Loading Jetak</span>

      {/* Same decoration language as the auth pages (purely visual). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute -start-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-white/10" />
        <span className="absolute -end-32 -bottom-40 h-[28rem] w-[28rem] rounded-full bg-white/10" />
        <span className="absolute end-[16%] top-[14%] h-14 w-14 rounded-full bg-white/10" />

        <ShoppingBag
          size={72}
          strokeWidth={1.25}
          className="absolute start-[10%] top-[22%] hidden -rotate-12 text-white/25 lg:block"
        />
        <Truck
          size={72}
          strokeWidth={1.25}
          className="absolute end-[9%] top-[34%] hidden rotate-6 text-white/25 lg:block"
        />
        <Package
          size={72}
          strokeWidth={1.25}
          className="absolute start-[14%] bottom-[16%] hidden rotate-12 text-white/25 lg:block"
        />
      </div>

      <div aria-hidden="true" className="relative px-6 text-center">
        <div className="animate-fade-in text-6xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl">
          Jet<span className="text-jetak-orange-light">ak</span>
        </div>

        {/* The inline delay makes the tagline appear after the name. It wins over the class,
            and the reduced-motion rule in index.css still overrides it with !important. */}
        <p
          className="animate-scale-in mt-4 text-sm font-medium tracking-wide text-white/90 sm:text-base"
          style={{ animationDelay: '350ms' }}
        >
          Order • Relax • We Deliver
        </p>
      </div>
    </div>
  )
}