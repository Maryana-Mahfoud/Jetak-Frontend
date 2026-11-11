/**
 * Root component: composes the global providers with the router.
 *
 * Provider order matters: AuthProvider (inside AppProviders) must wrap AppRouter,
 * because the route guards read the auth state through useAuth.
 */

import { AppProviders } from './app/providers/AppProviders'
import { AppRouter } from './app/router/AppRouter'

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

export default App