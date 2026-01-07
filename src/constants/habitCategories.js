export const HABIT_CATEGORIES = [
  { value: 'sport', label: 'Sport', color: '#ef4444' },
  { value: 'study', label: 'Study', color: '#d4af37' },
  { value: 'health', label: 'Health', color: '#22c55e' },
  { value: 'work', label: 'Work', color: '#3b82f6' },
  { value: 'other', label: 'Other', color: '#a855f7' }
]

export const HABIT_CATEGORY_MAP = HABIT_CATEGORIES.reduce((acc, item) => {
  acc[item.value] = item
  return acc
}, {})
