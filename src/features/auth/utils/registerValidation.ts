/**
 * Form values, validation and conversion for the register page.
 *
 * Pure functions with no React, so the page stays focused on the UI.
 * The Backend is the final judge: these checks only catch obvious mistakes early.
 */

import type { RegisterRequest } from '../types/auth.types'

// Confirmed by the Backend team: shorter passwords are rejected.
export const PASSWORD_MIN_LENGTH = 8

// Every form value is a string, because that is what inputs produce.
// Field names match the API request fields.
export interface RegisterFormValues {
    name: string
    phone: string
    email: string
    password: string
    building_number: string
    floor: string
    room_number: string
}

export type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>

export const INITIAL_REGISTER_VALUES: RegisterFormValues = {
    name: '',
    phone: '',
    email: '',
    password: '',
    building_number: '',
    floor: '',
    room_number: '',
    }

// A basic shape check only (something@something.something).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Step 1: account details.
export function validateAccountStep(values: RegisterFormValues): RegisterFormErrors {
        const errors: RegisterFormErrors = {}

    if (values.name.trim() === '') errors.name = 'Please enter your full name.'
    if (values.phone.trim() === '') errors.phone = 'Please enter your phone number.'

    const email = values.email.trim()
    if (email === '') errors.email = 'Please enter your email.'
    else if (!EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email address.'

    if (values.password === '') errors.password = 'Please enter a password.'
    else if (values.password.length < PASSWORD_MIN_LENGTH) {
        errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
    }

    return errors
}

// Returns an error message, or undefined when the value is a valid whole number.
    function checkWholeNumber(value: string, emptyMessage: string): string | undefined {
    if (value === '') return emptyMessage
    if (!Number.isSafeInteger(Number(value))) return 'Please enter a valid number.'
    return undefined
}

// Step 2: delivery address. Only "is a whole number" is checked here,
// because the allowed ranges have not been confirmed by the Backend team.
export function validateAddressStep(values: RegisterFormValues): RegisterFormErrors {
    const errors: RegisterFormErrors = {}

    const building = checkWholeNumber(values.building_number, 'Please enter your building number.')
    if (building !== undefined) errors.building_number = building

    const floor = checkWholeNumber(values.floor, 'Please enter your floor.')
    if (floor !== undefined) errors.floor = floor

    const room = checkWholeNumber(values.room_number, 'Please enter your room number.')
    if (room !== undefined) errors.room_number = room

    return errors
}

export function hasErrors(errors: RegisterFormErrors): boolean {
    return Object.values(errors).some((message) => message !== undefined)
}

// Converts the form strings into the request the API expects (numbers for the address).
// Call it only after both steps passed validation.
export function toRegisterRequest(values: RegisterFormValues): RegisterRequest {
    return {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        phone: values.phone.trim(),
        building_number: Number(values.building_number),
        floor: Number(values.floor),
        room_number: Number(values.room_number),
    }
}