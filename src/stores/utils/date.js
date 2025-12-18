export function isoFromDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function isoToday() {
  return isoFromDate(new Date())
}

export function addDays(date, delta) {
  const d = new Date(date)
  d.setDate(d.getDate() + delta)
  return d
}

export function monthKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function startOfDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function startOfWeekMonday(d = new Date()) {
  const day = startOfDay(d)
  const js = day.getDay()
  const monOffset = (js + 6) % 7
  return addDays(day, -monOffset)
}
