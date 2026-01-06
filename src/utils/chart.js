export function percentOfMax(value, series) {
  const arr = Array.isArray(series) ? series.map(Number) : []
  const max = Math.max(...arr, 1)
  const val = Number(value) || 0
  return Math.round((val / max) * 100)
}
