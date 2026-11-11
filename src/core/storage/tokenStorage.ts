/**
 * The only module that reads, writes or deletes the authentication token.
 *
 * The token is stored in localStorage (agreed with the Backend team).
 * Keeping all access in one file means we can change the storage
 * mechanism later (for example to cookies) by editing this file only.
 */

const TOKEN_STORAGE_KEY = 'jetak_auth_token'

// Returns the saved token, or null if there is none or storage is unavailable.
function getToken(): string | null {
    try {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY)
        return token !== null && token !== '' ? token : null
    } catch {
        // localStorage can throw (for example when the browser blocks storage).
        return null
    }
}

// Saves the token so the session survives a page refresh.
function setToken(token: string): void {
    try {
        localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } catch {
        // Ignore write failures: the user will simply need to log in again after a refresh.
    }
}

// Deletes the saved token (used on logout and when the server rejects it).
function clearToken(): void {
    try {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
    } catch {
        // Nothing to do if storage is unavailable.
    }
}

export const tokenStorage = {
  getToken,
  setToken,
  clearToken,
} as const