/**
 * Central place for reading and validating environment variables.
 *
 * Vite only exposes variables prefixed with VITE_ to client code.
 * Everything here ends up inside the public JavaScript bundle,
 * so never put secrets (keys, passwords) in these variables.
 */

// Reads a required variable and fails fast with a clear message if it is missing.
function readRequiredString(name: string, value: unknown): string {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(
        `Missing environment variable: ${name}. Add it to your .env file and restart the dev server.`,
        )
    }
    return value.trim()
}

// Removes trailing slashes so the base URL can be safely joined with paths like "/auth/login".
function removeTrailingSlashes(url: string): string {
    return url.replace(/\/+$/, '')
    }

    export const env = {
    apiBaseUrl: removeTrailingSlashes(
        readRequiredString('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
    ),
} as const