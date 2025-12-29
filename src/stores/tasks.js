import { defineStore } from 'pinia'
import { isoToday, startOfDay, startOfWeekMonday, addDays, monthKey } from '../stores/utils/date'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    nextId: 1
  }),

  getters: {
    hasActive(state) {
      return state.tasks.some(t => t.status === 'active')
    },

    activeTasks(state) {
      return state.tasks.filter(t => t.status === 'active')
    },
    completedTasks(state) {
      return state.tasks.filter(t => t.status === 'done')
    },

    activeHigh(state) {
      return state.tasks.filter(t => t.status === 'active' && t.priority === 'high')
    },
    activeMedium(state) {
      return state.tasks.filter(t => t.status === 'active' && t.priority === 'medium')
    },
    activeLow(state) {
      return state.tasks.filter(t => t.status === 'active' && t.priority === 'low')
    },

    countsByPriority() {
      return {
        high: this.activeHigh.length,
        medium: this.activeMedium.length,
        low: this.activeLow.length,
        total: this.activeHigh.length + this.activeMedium.length + this.activeLow.length
      }
    },

    completionPercent() {
      const total = this.activeTasks.length + this.completedTasks.length
      return total === 0 ? 0 : Math.round((this.completedTasks.length / total) * 100)
    },

    monthStats(state) {
      const now = new Date()
      const y = now.getFullYear()
      const m = now.getMonth()

      const monthTasks = state.tasks.filter(t => {
        if (!t.deadlineDate) return false
        const d = new Date(t.deadlineDate + 'T00:00:00')
        return d.getFullYear() === y && d.getMonth() === m
      })

      const total = monthTasks.length
      const done = monthTasks.filter(t => t.status === 'done').length
      const percent = total === 0 ? 0 : Math.round((done / total) * 100)

      return { total, done, percent }
    },

    importantTasks(state) {
      const tasks = state.tasks || []
      const today = startOfDay(new Date())

      return tasks
        .filter(t => t.status === 'active' && t.deadlineDate)
        .map(t => {
          const due = new Date(t.deadlineDate + 'T00:00:00')
          const diff = Math.round((due - today) / 86400000)
          return { ...t, _diff: diff }
        })
        .filter(t => t.priority === 'high' || t._diff <= 3)
        .sort((a, b) => {
          if (a.priority === 'high' && b.priority !== 'high') return -1
          if (a.priority !== 'high' && b.priority === 'high') return 1
          return a._diff - b._diff
        })
    },

    weeklyCompleted(state) {
      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      const monday = startOfWeekMonday(new Date())
      const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i))
      const isoDays = days.map(d => {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
      })

      const done = (state.tasks || []).filter(t => t.status === 'done' && t.completedAt)
      const map = Object.create(null)

      for (const t of done) {
        const key = t.completedAt
        map[key] = (map[key] || 0) + 1
      }

      return isoDays.map((iso, i) => ({ day: labels[i], count: map[iso] || 0 }))
    },

    mostProductiveDay() {
      const list = this.weeklyCompleted || []
      if (!list.length) return 'None'
      const max = list.reduce((a, b) => (b.count > a.count ? b : a), list[0])
      return max.count === 0 ? 'None' : max.day
    },

    monthlyHistory(state) {
      const now = new Date()
      const first = new Date(now.getFullYear(), now.getMonth(), 1)

      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(first)
        d.setMonth(d.getMonth() - (5 - i))
        return d
      })

      const labels = months.map(d => d.toLocaleString('en-US', { month: 'short' }))
      const keys = months.map(d => monthKey(d))

      const done = (state.tasks || []).filter(t => t.status === 'done' && t.completedAt)
      const map = Object.create(null)

      for (const t of done) {
        const d = new Date(t.completedAt + 'T00:00:00')
        if (Number.isNaN(d.getTime())) continue
        const k = monthKey(d)
        map[k] = (map[k] || 0) + 1
      }

      return keys.map((k, i) => ({ label: labels[i], count: map[k] || 0 }))
    }
  },

  actions: {
    storageKey() {
      const email = localStorage.getItem('current_user_email') || 'guest'
      return 'tasks_' + email
    },

    initFromStorage() {
      const raw = localStorage.getItem(this.storageKey())
      if (!raw) {
        this.tasks = []
        this.nextId = 1
        return
      }

      try {
        const parsed = JSON.parse(raw)

        if (Array.isArray(parsed)) {
          this.tasks = parsed.map(t => {
            const status = t.status || 'active'
            let completedAt = t.completedAt || ''

            if (status === 'done' && !completedAt) {
              completedAt = t.deadlineDate || isoToday()
            }

            return {
              id: Number(t.id),
              title: t.title || '',
              priority: ['high', 'medium', 'low'].includes(t.priority) ? t.priority : 'medium',
              deadlineDate: t.deadlineDate || '',
              status,
              completedAt
            }
          })

          const maxId = this.tasks.reduce((m, t) => (t.id > m ? t.id : m), 0)
          this.nextId = maxId + 1
          this.saveToStorage()
        } else {
          this.tasks = []
          this.nextId = 1
        }
      } catch (e) {
        this.tasks = []
        this.nextId = 1
      }
    },

    saveToStorage() {
      localStorage.setItem(this.storageKey(), JSON.stringify(this.tasks))
    },

    addTask(payload) {
      const title = (payload.title || '').trim()
      if (!title) return

      const p = ['high', 'medium', 'low'].includes(payload.priority) ? payload.priority : 'medium'

      this.tasks.push({
        id: this.nextId++,
        title,
        priority: p,
        deadlineDate: payload.deadlineDate || '',
        status: 'active',
        completedAt: ''
      })

      this.saveToStorage()
    },

    editTask(id, payload) {
      const t = this.tasks.find(x => x.id === id)
      if (!t) return

      t.title = (payload.title ?? t.title).trim?.() || t.title
      t.priority = ['high', 'medium', 'low'].includes(payload.priority) ? payload.priority : t.priority
      t.deadlineDate = payload.deadlineDate ?? t.deadlineDate

      this.saveToStorage()
    },

    deleteTask(id) {
      this.tasks = this.tasks.filter(t => t.id !== id)
      this.saveToStorage()
    },

    completeTask(id) {
      const t = this.tasks.find(x => x.id === id)
      if (!t) return
      t.status = 'done'
      t.completedAt = isoToday()
      this.saveToStorage()
    },
    resetAll() {
      this.tasks = []
      this.nextId = 1
      this.saveToStorage()
    }
  }
})
