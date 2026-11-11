/**
 * Shared types for talking to the Laravel Backend.
 */

/**
 * The response envelope seen in the documented success (200) responses.
 *
 * Only the envelope is shared: the shape of `data` is different for each
 * endpoint (for example `{ user, token }` for login, `null` for logout),
 * so every service must provide its own `T`.
 *
 * Do not assume error responses follow this shape. They are not documented yet.
 */
export interface ApiResponse<T> {
    status: boolean
    message: string
    data: T
}