export function validateTaskPayload(payload = {}) {
  const title = String(payload.title || '').trim()
  if (!title) return { ok: false, error: 'Title is required' }

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

  if (!name) return { ok: false, error: 'Name is required' }
  if (!isDaily && days.filter(Boolean).length === 0) {
    return { ok: false, error: 'Select at least one day', code: 'DAYS' }
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
