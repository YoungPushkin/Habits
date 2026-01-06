export function storageKey(base) {
  const email = localStorage.getItem('current_user_email') || 'guest'
  return `${base}_${email}`
}
