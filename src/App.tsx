/**
 * Root component: composes the global providers, the splash screen and the router.
 *
 * Order matters:
 * - AppProviders (AuthProvider) must be outermost, because SplashGate and the
 *   route guards read the session through useAuth.
 * - SplashGate wraps the router: it keeps the router unmounted until the splash
 *   is ready to leave, and it never brings the splash back on route changes.
 */

import { AppProviders } from './app/providers/AppProviders'
import { AppRouter } from './app/router/AppRouter'
import { SplashGate } from './app/splash/SplashGate'

function App() {
  return (
    <AppProviders>
      <SplashGate>
        <AppRouter />
      </SplashGate>
    </AppProviders>
  )
}

export default App