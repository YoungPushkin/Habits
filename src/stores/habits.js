import { defineStore } from 'pinia'
import { isoToday, isoFromDate, startOfDay, addDays } from '../utils/date.js'
import { storageKey } from '../utils/storageKey.js'

// HELPERS: week math and days normalization for UI/logic
function weekIndex(date = new Date()) {
  const js = date.getDay()
  return (js + 6) % 7
}

function normalizeDays(input) {
  const out = [false, false, false, false, false, false, false]
  if (!Array.isArray(input)) return out
  if (input.length === 7 && input.every(v => typeof v === 'boolean')) return input.slice(0, 7)
  if (input.every(v => Number.isInteger(v))) {
    input.forEach(i => {
      if (i >= 0 && i < 7) out[i] = true
    })
    return out
  }
  return out
}

function buildHabitsUI(habits, todayDoneMap, weekIdx, options = {}) {
  const todayOnly = !!options.todayOnly
  const list = Array.isArray(habits) ? habits : []
  const map = todayDoneMap || {}
  const idx = Number.isInteger(weekIdx) ? weekIdx : 0

  return list
    .filter(h => {
      if (!todayOnly) return true
      if (h.isDaily) return true
      return Array.isArray(h.days) ? !!h.days[idx] : false
    })
    .map(h => {
      const dueToday = h.isDaily ? true : (Array.isArray(h.days) ? !!h.days[idx] : false)
      return {
        ...h,
        name: h.name || h.title || '',
        category: h.category || 'other',
        dueToday,
        doneToday: !!map[h.id]
      }
    })
}

export const useHabitsStore = defineStore('habits', {
  // STATE: habits data + per-day completion
  state: () => ({
    habits: [],
    nextId: 1,
    doneByDate: {},
    completedDays: {},
    bestStreak: 0,
    currentDayKey: isoToday()
  }),

  // GETTERS: derived stats and UI-ready slices
  getters: {
    todayISO(state) {
      return state.currentDayKey
    },
    todayWeekIdx() {
      const parts = this.todayISO.split('-').map(Number)
      const date = new Date(parts[0], parts[1] - 1, parts[2])
      return weekIndex(date)
    },
    todayDoneMap(state) {
      const date = this.todayISO
      return state.doneByDate[date] || {}
    },
    todayHabits(state) {
      const idx = this.todayWeekIdx
      return (state.habits || []).filter(h => {
        if (h.isDaily) return true
        return Array.isArray(h.days) ? !!h.days[idx] : false
      })
    },
    todayHabitsForUI() {
      return buildHabitsUI(this.todayHabits, this.todayDoneMap, this.todayWeekIdx, { todayOnly: true })
    },
    todayTotal() {
      return this.todayHabits.length
    },
    todayDone() {
      const map = this.todayDoneMap
      return this.todayHabits.reduce((acc, h) => acc + (map[h.id] ? 1 : 0), 0)
    },
    todayAnyDone() {
      const map = this.todayDoneMap || {}
      return Object.values(map).some(Boolean)
    },
    completionPercent() {
      return this.todayTotal === 0 ? 0 : Math.round((this.todayDone / this.todayTotal) * 100)
    },

    isDayCounted() {
      return this.todayAnyDone
    },
    activeDays(state) {
      return Object.keys(state.completedDays || {}).filter(d => state.completedDays[d]).length
    },

    // UI helpers
    habitsUI(state) {
      return buildHabitsUI(state.habits, this.todayDoneMap, this.todayWeekIdx, { todayOnly: false })
    },

    currentStreak(state) {
      const today = this.todayISO
      const completedDays = state.completedDays || {}

      const parts = today.split('-').map(Number)
      if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return 0
      const todayDate = new Date(parts[0], parts[1] - 1, parts[2])

      let baseDate = null
      if (completedDays[today]) {
        baseDate = todayDate
      } else {
        const yesterday = isoFromDate(addDays(todayDate, -1))
        if (!completedDays[yesterday]) return 0
        baseDate = addDays(todayDate, -1)
      }

      let streak = 0
      let cursor = baseDate
      while (completedDays[isoFromDate(cursor)]) {
        streak++
        cursor = addDays(cursor, -1)
      }
      return streak
    },

    averageWeekly(state) {
      const completedDays = state.completedDays || {}
      const today = startOfDay(new Date())
      const from = addDays(today, -27)

      let doneDays = 0
      for (let i = 0; i < 28; i++) {
        const iso = (() => {
          const d = addDays(from, i)
          return d.toISOString().slice(0, 10)
        })()

        if (completedDays[iso]) doneDays++
      }

      return Math.round((doneDays / 28) * 100)
    },

    // UI helpers
    disciplineDots() {
      const s = Number(this.bestStreak || 0)
      return Math.min(7, Math.round(s / 2))
    },

    currentHabitNumber() {
      return (index) => {
        const total = this.todayHabitsForUI?.length || 0
        return total ? Number(index) + 1 : 0
      }
    },

    bestStreakCapped14() {
      return Math.min(14, Number(this.bestStreak || 0))
    },

    weakestHabit(state) {
      const habits = Array.isArray(state.habits) ? state.habits : []
      if (!habits.length) return null

      const doneByDate = state.doneByDate || {}
      const today = isoToday()
      const completion = habits.map(habit => {
        let due = 0
        let done = 0

        const created = String(habit.createdAt || '').slice(0, 10)
        const start = created && created.length === 10 ? created : today

        const startParts = start.split('-').map(Number)
        const endParts = today.split('-').map(Number)
        if (startParts.length !== 3 || endParts.length !== 3) {
          return { habit, percent: 0, due: 0, done: 0 }
        }

        let cursor = new Date(startParts[0], startParts[1] - 1, startParts[2])
        const endDate = new Date(endParts[0], endParts[1] - 1, endParts[2])

        while (cursor <= endDate) {
          const idx = weekIndex(cursor)
          const isDue = habit.isDaily ? true : (Array.isArray(habit.days) ? !!habit.days[idx] : false)
          if (isDue) {
            due++
            const iso = isoFromDate(cursor)
            if (doneByDate[iso] && doneByDate[iso][habit.id]) done++
          }
          cursor = addDays(cursor, 1)
        }

        const percent = due === 0 ? 0 : Math.round((done / due) * 100)
        return { habit, percent, due, done }
      })

      completion.sort((a, b) => {
        if (a.percent !== b.percent) return a.percent - b.percent
        if (a.done !== b.done) return a.done - b.done
        return (a.habit.name || a.habit.title || '').localeCompare(b.habit.name || b.habit.title || '')
      })

      return completion[0]
    }
  },

  // ACTIONS: persistence + CRUD + streak sync
  actions: {
    _save() {
      localStorage.setItem(storageKey('habits_store'), JSON.stringify({
        habits: this.habits,
        nextId: this.nextId,
        doneByDate: this.doneByDate,
        completedDays: this.completedDays,
        bestStreak: this.bestStreak,
        currentDayKey: this.currentDayKey
      }))
    },

    recalcBestStreak() {
      const completedDays = this.completedDays || {}
      const dates = Object.keys(completedDays).filter(d => completedDays[d]).sort()
      let best = 0
      let cur = 0

      for (let i = 0; i < dates.length; i++) {
        if (i === 0) {
          cur = 1
        } else {
          const diff = Math.floor((new Date(dates[i]) - new Date(dates[i - 1])) / 86400000)
          cur = diff === 1 ? (cur + 1) : 1
        }
        if (cur > best) best = cur
      }
      this.bestStreak = best
    },

    addHabit(payload) {
      const baseName = String(payload.name || payload.title || '').trim()
      const h = {
        id: this.nextId++,
        title: baseName,
        name: baseName,
        category: payload.category || 'other',
        description: String(payload.description || '').trim(),
        isDaily: !!payload.isDaily,
        days: normalizeDays(payload.days),
        createdAt: new Date().toISOString()
      }
      this.habits.push(h)
      this.ensureTodayBuckets()
      this.syncTodayCompletion()
      this._save()
      return { ok: true, habit: h }
    },

    editHabit(id, patch) {
      const idx = this.habits.findIndex(h => h.id === id)
      if (idx === -1) return { ok: false, error: 'Habit not found' }

      const prev = this.habits[idx]
      const next = {
        ...prev,
        title: patch.title != null ? String(patch.title).trim() : prev.title,
        name: patch.name != null ? String(patch.name).trim() : (prev.name || prev.title),
        category: patch.category != null ? patch.category : (prev.category || 'other'),
        description: patch.description != null ? String(patch.description).trim() : prev.description,
        isDaily: patch.isDaily != null ? !!patch.isDaily : prev.isDaily,
        days: patch.days != null ? normalizeDays(patch.days) : prev.days
      }

      this.habits[idx] = next
      this.ensureTodayBuckets()
      this.syncTodayCompletion()
      this._save()
      return { ok: true }
    },

    deleteHabit(id) {
      const before = this.habits.length
      this.habits = this.habits.filter(h => h.id !== id)
      const date = this.todayISO
      if (this.doneByDate[date] && this.doneByDate[date][id]) {
        delete this.doneByDate[date][id]
      }
      if (this.habits.length !== before) {
        this.ensureTodayBuckets()
        this.syncTodayCompletion()
        this._save()
        return { ok: true }
      }
      return { ok: false, error: 'Habit not found' }
    },

    toggleHabitDoneToday(id) {
      const exists = this.habits.some(h => h.id === id)
      if (!exists) return { ok: false, error: 'Habit not found' }

      this.ensureTodayBuckets()
      const date = this.todayISO
      if (!this.doneByDate[date]) this.doneByDate[date] = {}

      const isDone = !!this.doneByDate[date][id]
      if (isDone) delete this.doneByDate[date][id]
      else this.doneByDate[date][id] = true

      this.syncTodayCompletion()
      this._save()
      return { ok: true, done: !isDone }
    },

    ensureTodayBuckets() {
      const today = isoToday()
      if (this.currentDayKey !== today) {
        this.currentDayKey = today
      }
      if (!this.doneByDate[today]) this.doneByDate[today] = {}
    },

    syncTodayCompletion() {
      const date = this.todayISO
      const counted = this.isDayCounted

      if (counted && !this.completedDays[date]) {
        this.completedDays[date] = true
        this.recalcBestStreak()
      }

      if (!counted && this.completedDays[date]) {
        this.completedDays[date] = false
        this.recalcBestStreak()
      }
    },

    initFromStorage() {
      const raw = localStorage.getItem(storageKey('habits_store'))
      if (!raw) return

      try {
        const data = JSON.parse(raw)
        this.habits = Array.isArray(data.habits) ? data.habits : []
        this.nextId = Number.isInteger(data.nextId) ? data.nextId : 1
        this.doneByDate = data.doneByDate && typeof data.doneByDate === 'object' ? data.doneByDate : {}
        this.completedDays = data.completedDays && typeof data.completedDays === 'object' ? data.completedDays : {}
        this.bestStreak = Number.isInteger(data.bestStreak) ? data.bestStreak : 0
        this.currentDayKey = data.currentDayKey || isoToday()

        this.ensureTodayBuckets()
        this.syncTodayCompletion()
      } catch (e) {}
    },

    resetAll() {
      this.habits = []
      this.nextId = 1
      this.doneByDate = {}
      this.completedDays = {}
      this.bestStreak = 0
      this.currentDayKey = isoToday()
      localStorage.removeItem(storageKey('habits_store'))
    }
  }
})
