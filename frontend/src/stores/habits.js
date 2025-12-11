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
    addHabit(name, meta = '') {
      const h = { id: this.nextId++, name, meta, doneToday: false }
      this.habits.push(h)
    },
    toggleHabit(id) {
      const h = this.habits.find(x => x.id === id)
      if (!h) return
      h.doneToday = !h.doneToday

      const todayIndex = (new Date()).getDay()
      if (h.doneToday) {
        this.weekCounts[todayIndex] = Math.min(999, this.weekCounts[todayIndex] + 1)
      } else {
        this.weekCounts[todayIndex] = Math.max(0, this.weekCounts[todayIndex] - 1)
      }

      this.updateCompletedDay()
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
    },
    setWeekCounts(arr) {
      this.weekCounts = arr.slice(0, 7)
    }
  }
})
