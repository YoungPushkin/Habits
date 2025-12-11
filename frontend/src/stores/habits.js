import { defineStore } from 'pinia'

export const useHabitsStore = defineStore('habits', {
  state: () => ({
    habits: [],
    nextId: 1,
    weekCounts: [0, 0, 0, 0, 0, 0, 0],
    activityGridRows: 4,
    activityGridCols: 14,
    completedDates: []
  }),
  getters: {
    todayTotal: (state) => state.habits.length,
    todayDone: (state) => state.habits.filter(h => h.doneToday).length,
    completionPercent: (state) => {
      if (state.habits.length === 0) return 0
      return Math.round(
        (state.habits.filter(h => h.doneToday).length / state.habits.length) * 100
      )
    },
    weekMax: (state) => Math.max(1, ...state.weekCounts),
    activeDays: (state) => state.completedDates.length,
    bestStreak: (state) => {
      if (state.completedDates.length === 0) return 0
      const sorted = state.completedDates.slice().sort()
      let best = 1
      let current = 1
      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1])
        const curr = new Date(sorted[i])
        const diff = (curr - prev) / (1000 * 60 * 60 * 24)
        if (diff === 1) {
          current++
          if (current > best) best = current
        } else if (diff > 1) {
          current = 1
        }
      }
      return best
    }
  },
  actions: {
    storageKey() {
      const email = localStorage.getItem('current_user_email')
      if (!email) return null
      return 'habits_' + email
    },
    initFromStorage() {
      const key = this.storageKey()
      if (!key) {
        this.habits = []
        this.nextId = 1
        return
      }

      const raw = localStorage.getItem(key)
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) {
            this.habits = parsed
            const maxId = parsed.reduce((m, h) => (h.id > m ? h.id : m), 0)
            this.nextId = maxId + 1
          } else {
            this.habits = []
            this.nextId = 1
          }
        } catch (e) {
          this.habits = []
          this.nextId = 1
        }
      } else {
        this.habits = []
        this.nextId = 1
      }

      this.habits.forEach(h => {
        if (h.category === undefined) h.category = 'other'
        if (h.isDaily === undefined) h.isDaily = true
        if (!Array.isArray(h.days)) h.days = [true, true, true, true, true, false, false]
      })
    },
    saveToStorage() {
      const key = this.storageKey()
      if (!key) return
      localStorage.setItem(key, JSON.stringify(this.habits))
    },
    addHabit(
      name,
      meta = '',
      schedule = 'daily',
      category = 'other',
      isDaily = true,
      days = [true, true, true, true, true, false, false]
    ) {
      const h = {
        id: this.nextId++,
        name,
        meta,
        schedule,
        category,
        isDaily,
        days,
        createdAt: new Date().toISOString().slice(0, 10),
        doneToday: false
      }
      this.habits.push(h)
      this.saveToStorage()
    },
    editHabit(id, payload) {
      const h = this.habits.find(x => x.id === id)
      if (!h) return
      if (payload.name !== undefined) h.name = payload.name
      if (payload.meta !== undefined) h.meta = payload.meta
      if (payload.schedule !== undefined) h.schedule = payload.schedule
      if (payload.category !== undefined) h.category = payload.category
      if (payload.isDaily !== undefined) h.isDaily = payload.isDaily
      if (payload.days !== undefined && Array.isArray(payload.days)) h.days = payload.days
      this.saveToStorage()
    },
    deleteHabit(id) {
      const index = this.habits.findIndex(x => x.id === id)
      if (index === -1) return
      this.habits.splice(index, 1)
      this.updateCompletedDay()
      this.saveToStorage()
    },
    toggleHabit(id) {
      const h = this.habits.find(x => x.id === id)
      if (!h) return
      h.doneToday = !h.doneToday

      const todayIndex = new Date().getDay()
      if (h.doneToday) {
        this.weekCounts[todayIndex] = Math.min(999, this.weekCounts[todayIndex] + 1)
      } else {
        this.weekCounts[todayIndex] = Math.max(0, this.weekCounts[todayIndex] - 1)
      }

      this.updateCompletedDay()
      this.saveToStorage()
    },
    updateCompletedDay() {
      const todayStr = new Date().toISOString().slice(0, 10)
      const hasDone = this.habits.some(h => h.doneToday)
      const idx = this.completedDates.indexOf(todayStr)
      if (hasDone && idx === -1) this.completedDates.push(todayStr)
      if (!hasDone && idx !== -1) this.completedDates.splice(idx, 1)
    },
    resetAll() {
      this.habits = []
      this.nextId = 1
      this.weekCounts = [0, 0, 0, 0, 0, 0, 0]
      this.completedDates = []
      this.saveToStorage()
    },
    setWeekCounts(arr) {
      this.weekCounts = arr.slice(0, 7)
    }
  }
})
