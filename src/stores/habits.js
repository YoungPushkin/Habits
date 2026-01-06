import { defineStore } from 'pinia'
import { isoToday, startOfDay, addDays } from '../utils/date.js'
import { storageKey } from '../utils/storageKey.js'

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
  state: () => ({
    habits: [],
    nextId: 1,
    doneByDate: {},
    completedDays: {},
    bestStreak: 0,
    currentDayKey: isoToday()
  }),

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
    completionPercent() {
      return this.todayTotal === 0 ? 0 : Math.round((this.todayDone / this.todayTotal) * 100)
    },

    isDayFullyCompleted() {
      if (this.todayTotal === 0) return false
      return this.todayDone === this.todayTotal
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

      const dates = Object.keys(completedDays)
        .filter(d => completedDays[d])
        .sort()
        .reverse()

      if (!dates.length || dates[0] !== today) return 0

      let streak = 1
      for (let i = 1; i < dates.length; i++) {
        const diff = Math.floor((new Date(dates[i - 1]) - new Date(dates[i])) / 86400000)
        if (diff === 1) streak++
        else break
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
    }
  },

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
        this._save()
        return { ok: true }
      }
      return { ok: false, error: 'Habit not found' }
    },

    toggleHabitDoneToday(id) {
      this.ensureTodayBuckets()
      const date = this.todayISO
      if (!this.doneByDate[date]) this.doneByDate[date] = {}

      if (this.doneByDate[date][id]) return { ok: true }
      this.doneByDate[date][id] = true

      this.syncTodayCompletion()
      this._save()
      return { ok: true }
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
      const fully = this.isDayFullyCompleted

      if (fully && !this.completedDays[date]) {
        this.completedDays[date] = true
        this.recalcBestStreak()
      }

      if (!fully && this.completedDays[date]) {
        this.completedDays[date] = false
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
