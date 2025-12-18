import { defineStore } from 'pinia'

function isoToday() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

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

export const useHabitsStore = defineStore('habits', {
  state: () => ({
    habits: [],
    nextId: 1,
    doneByDate: {},
    completedDays: {},
    bestStreak: 0
  }),

  getters: {
    todayISO() {
      return isoToday()
    },
    todayWeekIdx() {
      return weekIndex(new Date())
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
    }
  },

  actions: {
    ensureTodayBuckets() {
      const date = this.todayISO
      if (!this.doneByDate[date]) this.doneByDate[date] = {}
      if (this.completedDays[date] === undefined) this.completedDays[date] = false
    },

    syncTodayCompletion() {
      this.ensureTodayBuckets()
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
      const raw = localStorage.getItem('habits_db')
      if (raw) {
        try {
          const data = JSON.parse(raw)
          this.habits = Array.isArray(data.habits) ? data.habits : []
          this.nextId = data.nextId || 1
          this.doneByDate = data.doneByDate || {}
          this.completedDays = data.completedDays || {}
          this.bestStreak = data.bestStreak || 0
        } catch (e) {}
      }

      this.habits = (this.habits || []).map(h => ({
        ...h,
        isDaily: !!h.isDaily,
        days: normalizeDays(h.days)
      }))

      this.ensureTodayBuckets()
      this.syncTodayCompletion()
      this.recalcBestStreak()
      this.saveToStorage()
    },

    saveToStorage() {
      localStorage.setItem(
        'habits_db',
        JSON.stringify({
          habits: this.habits,
          nextId: this.nextId,
          doneByDate: this.doneByDate,
          completedDays: this.completedDays,
          bestStreak: this.bestStreak
        })
      )
    },

    isHabitDueToday(habit) {
      const idx = this.todayWeekIdx
      if (!habit) return false
      if (habit.isDaily) return true
      return Array.isArray(habit.days) ? !!habit.days[idx] : false
    },

    isHabitDoneToday(id) {
      this.ensureTodayBuckets()
      return !!this.doneByDate[this.todayISO]?.[id]
    },

    addHabit(payload) {
      const name = (payload?.name || '').trim()
      if (!name) return

      const isDaily = !!payload.isDaily
      const days = normalizeDays(payload.days)

      this.habits.push({
        id: this.nextId++,
        name,
        category: payload.category || 'other',
        isDaily,
        days,
        createdAt: this.todayISO
      })

      this.syncTodayCompletion()
      this.saveToStorage()
    },

    editHabit(id, payload) {
      const h = this.habits.find(x => x.id === id)
      if (!h) return

      const name = (payload?.name || '').trim()
      if (!name) return

      h.name = name
      h.category = payload.category || 'other'
      h.isDaily = !!payload.isDaily
      h.days = normalizeDays(payload.days)

      this.syncTodayCompletion()
      this.saveToStorage()
    },

    deleteHabit(id) {
      this.habits = this.habits.filter(h => h.id !== id)

      Object.keys(this.doneByDate || {}).forEach(date => {
        if (this.doneByDate[date]) delete this.doneByDate[date][id]
      })

      this.syncTodayCompletion()
      this.saveToStorage()
    },

    toggleHabitDoneToday(id) {
      this.ensureTodayBuckets()

      const habit = this.habits.find(h => h.id === id)
      if (!habit) return
      if (!this.isHabitDueToday(habit)) return
      if (this.isHabitDoneToday(id)) return

      this.doneByDate[this.todayISO][id] = true

      this.syncTodayCompletion()
      this.saveToStorage()
    },

    recalcBestStreak() {
      const dates = Object.keys(this.completedDays || {})
        .filter(d => this.completedDays[d])
        .sort()

      let best = 0
      let cur = 0
      let prev = null

      for (const d of dates) {
        if (!prev) cur = 1
        else {
          const diff = Math.floor((new Date(d) - new Date(prev)) / 86400000)
          cur = diff === 1 ? cur + 1 : 1
        }
        if (cur > best) best = cur
        prev = d
      }

      this.bestStreak = best
    },

    resetAll() {
      this.habits = []
      this.nextId = 1
      this.doneByDate = {}
      this.completedDays = {}
      this.bestStreak = 0
      this.saveToStorage()
    }
  }
})
