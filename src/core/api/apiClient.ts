/**
 * Central HTTP client built on the Fetch API.
 *
 * Every request to the Laravel Backend goes through this file, so base URL,
 * headers, the Bearer token and error handling are configured in one place.
 * This module is independent of React: it never imports components or context.
 */

import { env } from '../config/env'
import { tokenStorage } from '../storage/tokenStorage'
import { createHttpApiError, createNetworkApiError } from './apiError'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface RequestOptions {
  // JSON body. Properties set to `undefined` are omitted by JSON.stringify,
  // which is what makes partial updates (send only changed fields) work.
    body?: object
    // Set to false for public endpoints (login, register) so no token is sent.
    auth?: boolean
    // Lets the caller cancel the request (for example when a component unmounts).
    signal?: AbortSignal
}

// GET and DELETE do not send a body.
type BodylessRequestOptions = Omit<RequestOptions, 'body'>

type UnauthorizedHandler = () => void

// Registered by the auth layer so this file never depends on React.
let unauthorizedHandler: UnauthorizedHandler | null = null

/**
 * Registers a function that is called when the Backend rejects a token we sent (401).
 * Pass null to unregister. The handler may be called more than once when several
 * requests fail at the same time, so it must be safe to call repeatedly.
 */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
    unauthorizedHandler = handler
}

// Joins the base URL (which already includes /api/v1) with an endpoint path like "/auth/login".
function buildUrl(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${env.apiBaseUrl}${normalizedPath}`
}

// An aborted request is an intentional cancel, not a network failure.
function isAbortError(error: unknown): boolean {
    return error instanceof DOMException && error.name === 'AbortError'
}

// Reads the response body as JSON. Returns null when it is empty or not valid JSON.
async function parseJsonBody(response: Response): Promise<unknown> {
    try {
    const text = await response.text()
    if (text === '') return null
    return JSON.parse(text) as unknown
    } catch {
    return null
    }
}

async function request<T>(
    method: HttpMethod,
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const token = options.auth === false ? null : tokenStorage.getToken()

  // Laravel returns redirects or HTML instead of JSON errors without the Accept header.
    const headers = new Headers({ Accept: 'application/json' })
    if (options.body !== undefined) headers.set('Content-Type', 'application/json')
    if (token !== null) headers.set('Authorization', `Bearer ${token}`)

    let response: Response
    try {
    response = await fetch(buildUrl(path), {
        method,
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: options.signal,
    })
    } catch (error) {
        if (isAbortError(error)) throw error
        // No response at all: offline, server down, DNS failure or a CORS block.
        throw createNetworkApiError()
    }

    const body = await parseJsonBody(response)

    if (!response.ok) {
    const error = createHttpApiError(response.status, body)

    // A 401 only means "session expired" if we actually sent a token.
    // A 401 from login (wrong credentials) must not clear anything.
    // We also compare tokens so a late 401 from an old request cannot
    // wipe a newer token saved by a login that happened in the meantime.
    if (error.kind === 'unauthorized' && token !== null && tokenStorage.getToken() === token) {
        tokenStorage.clearToken()
        unauthorizedHandler?.()
    }

    throw error
    }

  // All documented success responses are JSON envelopes. Anything else is unexpected.
    if (body === null) {
        throw createHttpApiError(response.status, null)
    }

  // The generic T is a type-level promise only: the shape is not validated at runtime.
    return body as T
}

export const apiClient = {
    get: <T>(path: string, options?: BodylessRequestOptions) => request<T>('GET', path, options),
    post: <T>(path: string, options?: RequestOptions) => request<T>('POST', path, options),
    put: <T>(path: string, options?: RequestOptions) => request<T>('PUT', path, options),
    delete: <T>(path: string, options?: BodylessRequestOptions) =>
        request<T>('DELETE', path, options),
} as const