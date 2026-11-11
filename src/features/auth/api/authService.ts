/**
 * Authentication service: one function per Auth endpoint.
 *
 * It calls apiClient, unwraps the `{ status, message, data }` envelope and
 * returns clean data. It does NOT touch the token storage and has no
 * dependency on React: saving the token is the job of AuthProvider.
 */

import { apiClient } from '../../../core/api/apiClient'
import { ApiError } from '../../../core/api/apiError'
import type { ApiResponse } from '../../../core/api/types'
import { isKnownRole } from '../config/roles'
import type {
    ApiUser,
    AuthResponseData,
    AuthUser,
    LoginRequest,
    MeResponseData,
    RegisterRequest,
} from '../types/auth.types'

// What a successful login gives back to the caller.
export interface LoginResult {
    user: AuthUser
    token: string
}

// Builds the error used when a 2xx response does not have the shape we expect.
function createUnexpectedResponseError(message: string): ApiError {
    return new ApiError({ kind: 'unknown', status: null, message })
}

/**
 * Converts the raw API user into the AuthUser the app keeps.
 * - Checks that the role exists and is one we support.
 * - Copies known fields explicitly, so extra data returned by /me
 *   (wallet, bread_subscriptions, bookings) never leaks into the auth state.
 */
function toAuthUser(apiUser: ApiUser | undefined): AuthUser {
    if (apiUser === undefined || apiUser === null) {
        throw createUnexpectedResponseError('استجابة غير متوقعة من الخادم.')
    }

    if (!isKnownRole(apiUser.role)) {
        throw createUnexpectedResponseError('دور حسابك غير معروف أو غير مدعوم.')
    }

    return {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        phone: apiUser.phone,
        status: apiUser.status,
        building_number: apiUser.building_number,
        floor: apiUser.floor,
        room_number: apiUser.room_number,
        created_at: apiUser.created_at,
        email_verified_at: apiUser.email_verified_at,
        updated_at: apiUser.updated_at,
        role: apiUser.role,
    }
}

// Reads the token from a login or register response and makes sure it is a non-empty string.
function readToken(data: AuthResponseData | undefined): string {
    const token = data?.token
    if (typeof token !== 'string' || token === '') {
        throw createUnexpectedResponseError('استجابة غير متوقعة من الخادم.')
    }
    return token
}

// POST /auth/login (public endpoint: no token is sent).
async function login(credentials: LoginRequest): Promise<LoginResult> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', {
        body: credentials,
        auth: false,
    })

    return {
        user: toAuthUser(response.data?.user),
        token: readToken(response.data),
    }
}

/**
 * POST /auth/register (public endpoint: no token is sent).
 * Returns only the token: the register response does not include `role` yet,
 * so the caller must save the token and then call getCurrentUser().
 */
async function register(data: RegisterRequest): Promise<{ token: string }> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', {
        body: data,
        auth: false,
    })

    return { token: readToken(response.data) }
}

// POST /auth/logout. The Backend deletes the current token. The caller clears it locally.
async function logout(): Promise<void> {
    await apiClient.post<ApiResponse<null>>('/auth/logout')
}

// GET /auth/me. Used to restore the session after a page refresh.
async function getCurrentUser(signal?: AbortSignal): Promise<AuthUser> {
    const response = await apiClient.get<ApiResponse<MeResponseData>>('/auth/me', { signal })
    return toAuthUser(response.data?.user)
}

export const authService = {
    login,
    register,
    logout,
    getCurrentUser,
} as const