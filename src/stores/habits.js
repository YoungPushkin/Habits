import { defineStore } from 'pinia'

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const useHabitsStore = defineStore('habits', {
  state: () => ({
    habits: [],
    nextId: 1,
    completedDays: {},
    activityGridRows: 4,
    activityGridCols: 14
  }),
  getters: {
    todayTotal(state) {
      return state.habits.length
    },
    todayDone(state) {
      return state.habits.filter(h => h.doneToday).length
    },
    completionPercent(state) {
      if (!state.habits.length) return 0
      return Math.round(
        (state.habits.filter(h => h.doneToday).length / state.habits.length) * 100
      )
    },
    activeDays(state) {
      return Object.values(state.completedDays).filter(Boolean).length
    },
    bestStreak(state) {
      const dates = Object.keys(state.completedDays).filter(d => state.completedDays[d])
      if (!dates.length) return 0
      const sorted = dates.sort()
      let best = 1
      let current = 1
      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1])
        const curr = new Date(sorted[i])
        const diff = (curr - prev) / (1000 * 60 * 60 * 24)
        if (diff === 1) {
          current++
          if (current > best) best = current
        } else {
          current = 1
        }
      }
      return best
    }
  },
  actions: {
    storageKey() {
      const email = localStorage.getItem('current_user_email') || 'guest'
      return 'habits_' + email
    },
    initFromStorage() {
      const raw = localStorage.getItem(this.storageKey())
      if (!raw) {
        this.habits = []
        this.nextId = 1
        this.completedDays = {}
        return
      }
      try {
        const parsed = JSON.parse(raw)
        if (!parsed || typeof parsed !== 'object') {
          this.habits = []
          this.nextId = 1
          this.completedDays = {}
          return
        }
        const habits = Array.isArray(parsed.habits) ? parsed.habits : []
        this.habits = habits.map(h => ({
          id: h.id,
          name: h.name || '',
          description: h.description || '',
          type: h.type || 'custom',
          category: h.category || 'neutral',
          isDaily: typeof h.isDaily === 'boolean' ? h.isDaily : true,
          days: Array.isArray(h.days) ? h.days : [],
          doneToday: !!h.doneToday,
          createdAt: h.createdAt || todayISO(),
          history: h.history && typeof h.history === 'object' ? h.history : {}
        }))
        const maxId = this.habits.reduce((m, h) => (h.id > m ? h.id : m), 0)
        this.nextId = maxId + 1
        this.completedDays =
          parsed.completedDays && typeof parsed.completedDays === 'object'
            ? parsed.completedDays
            : {}
      } catch (e) {
        this.habits = []
        this.nextId = 1
        this.completedDays = {}
      }
    },
    saveToStorage() {
      const payload = {
        habits: this.habits,
        completedDays: this.completedDays
      }
      localStorage.setItem(this.storageKey(), JSON.stringify(payload))
    },
    addHabit(name, description = '', type = 'custom', category = 'neutral', isDaily = true, days = []) {
      const n = (name || '').trim()
      if (!n) return
      const habit = {
        id: this.nextId++,
        name: n,
        description: description || '',
        type: type || 'custom',
        category,
        isDaily: !!isDaily,
        days: Array.isArray(days) ? days : [],
        doneToday: false,
        createdAt: todayISO(),
        history: {}
      }
      this.habits.push(habit)
      this.saveToStorage()
    },
    editHabit(id, payload) {
      const h = this.habits.find(x => x.id === id)
      if (!h) return
      if (payload.name !== undefined) {
        const n = (payload.name || '').trim()
        if (n) h.name = n
      }
      if (payload.category !== undefined) {
        h.category = payload.category
      }
      if (payload.isDaily !== undefined) {
        h.isDaily = !!payload.isDaily
      }
      if (payload.days !== undefined) {
        h.days = Array.isArray(payload.days) ? payload.days : []
      }
      this.saveToStorage()
    },
    deleteHabit(id) {
      this.habits = this.habits.filter(h => h.id !== id)
      this.rebuildCompletedDays()
      this.saveToStorage()
    },
    toggleHabit(id) {
      const h = this.habits.find(x => x.id === id)
      if (!h) return
      const d = todayISO()
      h.doneToday = !h.doneToday
      if (!h.history) h.history = {}
      if (h.doneToday) {
        h.history[d] = true
      } else {
        delete h.history[d]
      }
      this.recalculateCompletedDay(d)
      this.saveToStorage()
    },
    recalculateCompletedDay(dateStr) {
      const anyCompleted = this.habits.some(h => h.history && h.history[dateStr])
      if (anyCompleted) {
        this.completedDays[dateStr] = true
      } else {
        delete this.completedDays[dateStr]
      }
    },
    rebuildCompletedDays() {
      const map = {}
      this.habits.forEach(h => {
        if (!h.history) return
        Object.keys(h.history).forEach(d => {
          if (h.history[d]) map[d] = true
        })
      })
      this.completedDays = map
    },
    resetAll() {
      this.habits = []
      this.nextId = 1
      this.completedDays = {}
      this.saveToStorage()
    }
  }
})
