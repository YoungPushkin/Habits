import { VALIDATION_ERRORS } from '../constants/errors.js'
import { parseISODate, startOfDay } from './date.js'

export function validateTaskPayload(payload = {}) {
  const title = String(payload.title || '').trim()
  if (!title) return { ok: false, error: VALIDATION_ERRORS.TITLE_REQUIRED }

  const deadlineRaw = payload.deadlineDate || payload.deadline || payload.date || ''
  if (deadlineRaw) {
    const deadline = parseISODate(deadlineRaw)
    if (!deadline) return { ok: false, error: VALIDATION_ERRORS.DATE_INVALID }

    const today = startOfDay(new Date())
    if (startOfDay(deadline) < today) {
      return { ok: false, error: VALIDATION_ERRORS.DEADLINE_PAST }
    }
  }

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
