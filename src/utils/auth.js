export function normalizeEmail(val) {
  return (val || '').trim().toLowerCase()
}

export function normalizePassword(val) {
  return (val || '').trim()
}

import { AUTH_ERRORS } from '../constants/errors.js'

export function validateAuthFields(rawEmail, rawPassword) {
  const email = normalizeEmail(rawEmail)
  const password = normalizePassword(rawPassword)

  if (!email) return { ok: false, email, password, message: AUTH_ERRORS.EMAIL_REQUIRED }
  if (!email.includes('@')) return { ok: false, email, password, message: AUTH_ERRORS.EMAIL_INVALID }
  if (!password) return { ok: false, email, password, message: AUTH_ERRORS.PASSWORD_REQUIRED }

  return { ok: true, email, password, message: '' }
}
