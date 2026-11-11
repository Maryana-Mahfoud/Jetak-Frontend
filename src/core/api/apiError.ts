/**
 * A single, uniform error type for everything that can go wrong
 * when calling the Backend.
 *
 * The rest of the app never inspects raw Response objects or status codes:
 * it catches an ApiError and reads `kind`, `message` and `fieldErrors`.
 * This file has no dependency on React.
 */

// A union of string literals is used instead of an enum because the
// project enables "erasableSyntaxOnly".
export type ApiErrorKind =
    | 'network'
    | 'unauthorized'
    | 'forbidden'
    | 'validation'
    | 'client'
    | 'server'
    | 'unknown'

// Laravel-style validation errors: field name -> list of messages.
// The Backend team said validation errors come inside `message`, so this is optional.
export type FieldErrors = Record<string, string[]>

// Fallback texts shown to the user when we do not use (or do not have) a Backend message.
const FALLBACK_MESSAGES: Record<ApiErrorKind, string> = {
    network: 'تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.',
    unauthorized: 'يجب تسجيل الدخول للمتابعة.',
    forbidden: 'ليست لديك صلاحية لتنفيذ هذا الإجراء.',
    validation: 'البيانات المدخلة غير صحيحة.',
    client: 'تعذّر تنفيذ الطلب.',
    server: 'حدث خطأ في الخادم. حاول مرة أخرى لاحقاً.',
    unknown: 'حدث خطأ غير متوقع.',
}

// Only these kinds may show the Backend `message` to the user.
// For network, server and unknown errors we always show our own text,
// so technical details never reach the screen.
const KINDS_USING_BACKEND_MESSAGE: readonly ApiErrorKind[] = [
    'unauthorized',
    'forbidden',
    'validation',
    'client',
]

interface ApiErrorInit {
    kind: ApiErrorKind
    message: string
    status: number | null
    fieldErrors?: FieldErrors | null
}

export class ApiError extends Error {
    readonly kind: ApiErrorKind
    // HTTP status code, or null when no response was received (network failure).
    readonly status: number | null
    readonly fieldErrors: FieldErrors | null

  // Fields are assigned explicitly (no parameter properties) because of "erasableSyntaxOnly".
    constructor(init: ApiErrorInit) {
        super(init.message)
        this.name = 'ApiError'
        this.kind = init.kind
        this.status = init.status
        this.fieldErrors = init.fieldErrors ?? null
    }
}

// Narrows `unknown` to a plain object so its properties can be read safely.
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Reads a non-empty string `message` from a parsed response body, if present.
function extractMessage(body: unknown): string | null {
    if (!isRecord(body)) return null
    const message = body.message
    return typeof message === 'string' && message.trim() !== '' ? message.trim() : null
}

// Reads Laravel-style `errors` ({ field: [messages] }) from a parsed response body, if present.
function extractFieldErrors(body: unknown): FieldErrors | null {
    if (!isRecord(body) || !isRecord(body.errors)) return null

    const result: FieldErrors = {}
    for (const [field, value] of Object.entries(body.errors)) {
        if (Array.isArray(value)) {
        const messages = value.filter((item): item is string => typeof item === 'string')
        if (messages.length > 0) result[field] = messages
        }
    }
    return Object.keys(result).length > 0 ? result : null
}

// Maps an HTTP status code to an error kind.
function getKindFromStatus(status: number): ApiErrorKind {
    if (status === 401) return 'unauthorized'
    if (status === 403) return 'forbidden'
    if (status === 422) return 'validation'
    if (status >= 400 && status < 500) return 'client'
    if (status >= 500) return 'server'
    return 'unknown'
}

/**
 * Builds an ApiError from an HTTP response that was not successful.
 * `body` is the parsed JSON body, or null/undefined when it was missing or not JSON.
 * The body shape is not assumed: everything is read defensively.
 */
export function createHttpApiError(status: number, body: unknown): ApiError {
    const kind = getKindFromStatus(status)
    const backendMessage = KINDS_USING_BACKEND_MESSAGE.includes(kind) ? extractMessage(body) : null

    return new ApiError({
    kind,
    status,
    message: backendMessage ?? FALLBACK_MESSAGES[kind],
    fieldErrors: extractFieldErrors(body),
    })
}

// Builds an ApiError for the case where no response arrived (offline, DNS, CORS block, timeout...).
export function createNetworkApiError(): ApiError {
    return new ApiError({
        kind: 'network',
        status: null,
        message: FALLBACK_MESSAGES.network,
    })
}