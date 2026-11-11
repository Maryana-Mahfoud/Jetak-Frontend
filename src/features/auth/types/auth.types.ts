/**
 * Types for the authentication feature.
 *
 * Field names match the Laravel Backend exactly (snake_case) and are not renamed.
 * Types for change-password and housing info live in the profile feature.
 */

import type { UserRole } from '../config/roles'

// Fields that appear in every documented response containing a user.
interface UserBase {
  id: number
  name: string
  email: string
  // A string (not a number) because phone numbers start with 0.
  phone: string
  // Only "active" has been seen so far, so this stays a plain string until the Backend confirms the values.
  status: string
  building_number: number
  floor: number
  room_number: number
  created_at: string
  // Returned by some endpoints only (not by login), so both are optional.
  email_verified_at?: string | null
  updated_at?: string
}

/**
 * A user exactly as it arrives from the API (not validated yet).
 * `role` is optional and unchecked: login returns it, but register and /me
 * do not return it yet (confirmed with a real /me response; the Backend team
 * said they can add it).
 *
 * /me also returns `wallet`, `bread_subscriptions` and `bookings` inside the user.
 * They are intentionally not typed here: they belong to other features.
 */
export interface ApiUser extends UserBase {
  role?: string
}

/**
 * A user the app accepts and keeps in AuthContext.
 * `role` is required and has been checked against the roles we support.
 */
export interface AuthUser extends UserBase {
  role: UserRole
}

// The state of the session as seen by the whole app.
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error'

// POST /auth/login request body.
export interface LoginRequest {
  email: string
  password: string
}

// POST /auth/register request body. There is no `role` field: the Backend assigns Student.
export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone: string
  // The API receives numbers, so form values (strings) must be converted before sending.
  building_number: number
  floor: number
  room_number: number
}

// The `data` part of a successful login or register response.
export interface AuthResponseData {
  user: ApiUser
  token: string
}

// The `data` part of a successful GET /auth/me response.
export interface MeResponseData {
  user: ApiUser
}