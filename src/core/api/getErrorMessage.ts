/**
 * Turns any error thrown by a service into a message that is safe to show to the user.
 *
 * - Messages written by the Backend are shown for client-side problems
 *   (wrong credentials, validation, forbidden), because they explain what to fix.
 * - For network and server problems we show our own English text, so technical
 *   details never reach the screen.
 *
 * This file has no dependency on React.
 */

import { ApiError } from './apiError'
import type { ApiErrorKind } from './apiError'

// Kinds where the Backend `message` helps the user fix the problem.
const KINDS_USING_BACKEND_MESSAGE: readonly ApiErrorKind[] = [
    'unauthorized',
    'forbidden',
    'validation',
    'client',
]

const FALLBACK_MESSAGES: Record<ApiErrorKind, string> = {
    network: 'Unable to reach the server. Check your internet connection and try again.',
    unauthorized: 'Your session is not valid. Please log in again.',
    forbidden: "You don't have permission to do this.",
    validation: 'Some of the information you entered is not valid.',
    client: 'The request could not be completed.',
    server: 'Something went wrong on our side. Please try again later.',
    unknown: 'An unexpected error occurred. Please try again.',
}

export function getErrorMessage(error: unknown): string {
    // Anything that is not an ApiError is unexpected: never show its raw text.
    if (!(error instanceof ApiError)) return FALLBACK_MESSAGES.unknown

    if (KINDS_USING_BACKEND_MESSAGE.includes(error.kind) && error.message.trim() !== '') {
        return error.message
    }

    return FALLBACK_MESSAGES[error.kind]
}