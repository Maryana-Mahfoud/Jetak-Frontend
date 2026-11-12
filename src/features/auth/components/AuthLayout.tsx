/**
 * Shared shell of the public auth pages (login and register).
 *
 * Mobile (< 640px): an orange header with the brand, and a white card overlapping it.
 * Tablet and desktop (>= 640px): the whole page is an orange gradient with the brand
 * centered at the top and the card right below it, so the brand and the card read as one unit.
 *
 * Short windows: from 640px up, the sizes scale with the window height (clamp + vh) and the
 * spacing scale is slightly reduced, so the tall register card fits without a page scrollbar
 * on most laptops. On tall screens everything keeps its full size.
 *
 * Motion:
 * - The card fades in and rises a little when this layout first appears.
 * - Switching between login and register only fades the content INSIDE the card.
 *   The header and the card frame stay in place, so there is no flash and no reload
 *   (the tabs are client-side links and this layout route does not remount).
 *
 * The same elements are used for both layouts (only the classes change),
 * so the brand is rendered once and screen readers do not read it twice.
 *
 * Used as a layout route, so each page only renders its own content inside the card:
 *   <Route element={<AuthLayout />}>
 *     <Route path="/login" element={<LoginPage />} />
 *   </Route>
 */

import { Package, ShoppingBag, Truck } from 'lucide-react'
import { Outlet, useLocation } from 'react-router'

export function AuthLayout() {
  const { pathname } = useLocation()

  return (
    // [--spacing:...] overrides Tailwind's base spacing unit for everything inside this layout:
    // 4px on tall windows, down to 3px on short ones. Only from 640px up (sm:), so phones are untouched.
    <div className="relative min-h-dvh overflow-hidden sm:flex sm:items-start sm:justify-center sm:bg-linear-to-br sm:from-jetak-orange sm:to-jetak-orange-dark sm:px-6 sm:pt-[clamp(0.75rem,calc(12vh_-_3rem),7rem)] sm:pb-[clamp(0.75rem,3vh,3rem)] sm:[--spacing:clamp(0.1875rem,0.45vh,0.25rem)]">
      {/* Decorations for tablet and desktop only (purely visual, hidden from screen readers). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden sm:block">
        {/* Large translucent circles, like the mobile header. */}
        <span className="absolute -start-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-white/10" />
        <span className="absolute -end-32 -bottom-40 h-[28rem] w-[28rem] rounded-full bg-white/10" />
        <span className="absolute end-[16%] top-[14%] h-14 w-14 rounded-full bg-white/10" />

        {/* Delivery-themed icons, very faint, on large screens only. */}
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

      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white sm:min-h-0 sm:max-w-[28rem] sm:bg-transparent">
        <header className="relative overflow-hidden bg-linear-to-br from-jetak-orange to-jetak-orange-dark px-6 pt-12 pb-16 text-center sm:overflow-visible sm:bg-none sm:p-0">
          {/* Decorative circles of the mobile header. */}
          <span
            aria-hidden="true"
            className="absolute -start-10 -top-10 h-40 w-40 rounded-full bg-white/10 sm:hidden"
          />
          <span
            aria-hidden="true"
            className="absolute -end-8 -bottom-12 h-48 w-48 rounded-full bg-white/10 sm:hidden"
          />
          <span
            aria-hidden="true"
            className="absolute end-10 top-6 h-12 w-12 rounded-full bg-white/10 sm:hidden"
          />

          {/* The gap below the brand shrinks on short windows. */}
          <div className="relative sm:mb-[clamp(0.75rem,2.5vh,2.5rem)]">
            {/* Brand size: between 32px and 60px depending on the window height. */}
            <div
              aria-label="Jetak"
              className="text-4xl font-extrabold tracking-tight text-white sm:text-[length:clamp(2rem,5.5vh,3.75rem)] sm:leading-none"
            >
              Jet<span className="text-jetak-orange-light">ak</span>
            </div>
            <p className="mt-2 text-xs font-medium tracking-wide text-white/90 sm:mt-3 sm:text-sm">
              Order • Relax • We Deliver
            </p>
          </div>
        </header>

        {/* On mobile the negative margin pulls the card up over the header. */}
        <main className="animate-fade-up relative -mt-6 flex-1 rounded-t-[2rem] bg-white px-6 pt-8 pb-10 sm:mt-0 sm:flex-none sm:rounded-[2rem] sm:px-10 sm:py-[clamp(1.25rem,3vh,2.5rem)] sm:shadow-popup sm:ring-1 sm:ring-white/50">
          {/*
            The key changes with the path, so React replaces this wrapper and the short
            fade plays again when the user switches between login and register.
            Opacity only (no movement), so it never competes with the card entrance above.
            The inline duration makes it quicker than the default animation; the reduced-motion
            rule in index.css still wins because it uses !important.
          */}
          <div key={pathname} className="animate-fade-in" style={{ animationDuration: '250ms' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}