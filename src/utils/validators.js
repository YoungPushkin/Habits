import { VALIDATION_ERRORS } from '../constants/errors.js'

export function validateTaskPayload(payload = {}) {
  const title = String(payload.title || '').trim()
  if (!title) return { ok: false, error: VALIDATION_ERRORS.TITLE_REQUIRED }

  return {
    ok: true,
    payload: {
      ...payload,
      title
    }
  }
}

export function validateHabitPayload(payload = {}) {
  const name = String(payload.name || payload.title || '').trim()
  const days = Array.isArray(payload.days) ? payload.days : []
  const isDaily = !!payload.isDaily

  if (!name) return { ok: false, error: VALIDATION_ERRORS.NAME_REQUIRED }
  if (!isDaily && days.filter(Boolean).length === 0) {
    return { ok: false, error: VALIDATION_ERRORS.DAYS_REQUIRED, code: 'DAYS' }
  }

  return {
    ok: true,
    payload: {
      ...payload,
      name,
      title: name
    }
  }
}
