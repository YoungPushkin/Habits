export function normalizeEmail(val) {
  return (val || '').trim().toLowerCase()
}

export function normalizePassword(val) {
  return (val || '').trim()
}

export function validateAuthFields(rawEmail, rawPassword) {
  const email = normalizeEmail(rawEmail)
  const password = normalizePassword(rawPassword)

  if (!email) return { ok: false, email, password, message: 'Email is required' }
  if (!email.includes('@')) return { ok: false, email, password, message: 'Email is not valid' }
  if (!password) return { ok: false, email, password, message: 'Password is required' }

  return { ok: true, email, password, message: '' }
}
