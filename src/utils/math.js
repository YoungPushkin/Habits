export function percent(part, total, precision = 0) {
  const p = Number(part) || 0
  const t = Number(total) || 0
  if (t === 0) return 0
  const value = (p / t) * 100
  if (!Number.isFinite(value)) return 0
  return Number(value.toFixed(precision))
}
