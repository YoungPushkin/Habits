import { defineStore } from 'pinia'
import { startOfDay, startOfWeekMonday, addDays, monthKey, isoFromDate } from '../utils/date.js'
import { storageKey } from '../utils/storageKey.js'
import { percent } from '../utils/math.js'

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

    activeHigh() {
      return this.activeTasks.filter(t => t.priority === 'high')
    },

    activeMedium() {
      return this.activeTasks.filter(t => t.priority === 'medium')
    },

    activeLow() {
      return this.activeTasks.filter(t => t.priority === 'low')
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
      return percent(this.completedTasks.length, total)
    },

    monthStats(state) {
      const now = new Date()
      const mk = monthKey(now)
      const monthTasks = (state.tasks || []).filter(t => {
        if (t.completedAt) return monthKey(new Date(t.completedAt)) === mk
        return t.monthKey === mk
      })
      const total = monthTasks.length
      const done = monthTasks.filter(t => t.status === 'done').length
      const pct = percent(done, total)
      return { total, done, percent: pct }
    },

    // Dashboard/UI helpers (keep Views dumb)
    monthTasksDone() {
      return this.monthStats?.done ?? 0
    },
    monthTasksTotal() {
      return this.monthStats?.total ?? 0
    },
    monthTasksPercent() {
      return this.monthStats?.percent ?? 0
    },

    currentTaskNumber() {
      return (index) => {
        const total = this.importantTasks?.length || 0
        return total ? Number(index) + 1 : 0
      }
    },

    // Analytics aliases
    activeTasksCount() {
      return this.activeTasks.length
    },
    completedTasksCount() {
      return this.completedTasks.length
    },
    totalTasks() {
      return this.activeTasks.length
    },
    tasksCompletionPercent() {
      return this.completionPercent
    },
    highCount() {
      return this.countsByPriority.high
    },
    mediumCount() {
      return this.countsByPriority.medium
    },
    lowCount() {
      return this.countsByPriority.low
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
      const isoDays = days.map(d => isoFromDate(d))

      const done = (state.tasks || []).filter(t => t.status === 'done' && t.completedAt)
      const map = Object.create(null)

      for (const t of done) {
        const d = new Date(t.completedAt)
        if (Number.isNaN(d.getTime())) continue
        const iso = isoFromDate(d)
        map[iso] = (map[iso] || 0) + 1
      }

      return labels.map((label, i) => ({ label, day: label, count: map[isoDays[i]] || 0 }))
    },

    mostProductiveDay(state) {
      const done = (state.tasks || []).filter(t => t.status === 'done' && t.completedAt)
      if (!done.length) return '—'

      const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const map = Object.create(null)

      for (const t of done) {
        const d = new Date(t.completedAt)
        const key = labels[d.getDay()]
        map[key] = (map[key] || 0) + 1
      }

      let best = '—'
      let bestCount = -1
      for (const k of Object.keys(map)) {
        if (map[k] > bestCount) {
          best = k
          bestCount = map[k]
        }
      }
      return best
    },

    monthlyHistory(state) {
      const done = (state.tasks || [])
        .filter(t => t.status === 'done' && t.completedAt)
        .map(t => new Date(t.completedAt))
        .filter(d => !Number.isNaN(d.getTime()))
        .sort((a, b) => a - b)

      if (!done.length) return []

      const toMonthIndex = (d) => d.getFullYear() * 12 + d.getMonth()

      const now = new Date()
      const firstMonth = new Date(done[0].getFullYear(), done[0].getMonth(), 1)

      const monthsFromStart = toMonthIndex(now) - toMonthIndex(firstMonth)
      const cycleStartOffset = Math.floor(monthsFromStart / 6) * 6
      const startMonthIndex = toMonthIndex(firstMonth) + cycleStartOffset
      const endMonthIndex = startMonthIndex + 5

      const months = Array.from({ length: 6 }, (_, i) => {
        const idx = startMonthIndex + i
        const y = Math.floor(idx / 12)
        const m = idx % 12
        return new Date(y, m, 1)
      })

      const map = Object.create(null)

      for (const d of done) {
        const idx = toMonthIndex(d)
        if (idx < startMonthIndex || idx > endMonthIndex) continue
        const k = monthKey(d)
        map[k] = (map[k] || 0) + 1
      }

      return months.map(d => ({
        label: d.toLocaleString('en-US', { month: 'short' }),
        count: map[monthKey(d)] || 0
      }))
    }
  },

  actions: {
    _save() {
      localStorage.setItem(storageKey('tasks_store'), JSON.stringify({
        tasks: this.tasks,
        nextId: this.nextId
      }))
    },

    initFromStorage() {
      const raw = localStorage.getItem(storageKey('tasks_store'))
      if (!raw) return
      try {
        const data = JSON.parse(raw)
        this.tasks = Array.isArray(data.tasks) ? data.tasks : []
        this.nextId = Number.isInteger(data.nextId) ? data.nextId : 1
      } catch (e) {}
    },

    addTask(payload) {
      const t = {
        id: this.nextId++,
        title: String(payload.title || '').trim(),
        description: String(payload.description || '').trim(),
        priority: payload.priority || 'medium',
        deadlineDate: payload.deadlineDate || '',
        monthKey: monthKey(new Date()),
        status: 'active',
        createdAt: new Date().toISOString(),
        completedAt: null
      }
      this.tasks.push(t)
      this._save()
      return { ok: true, task: t }
    },

    editTask(id, patch) {
      const idx = this.tasks.findIndex(t => t.id === id)
      if (idx === -1) return { ok: false, error: 'Task not found' }
      const prev = this.tasks[idx]
      this.tasks[idx] = {
        ...prev,
        title: patch.title != null ? String(patch.title).trim() : prev.title,
        description: patch.description != null ? String(patch.description).trim() : prev.description,
        priority: patch.priority != null ? patch.priority : prev.priority,
        deadlineDate: patch.deadlineDate != null ? patch.deadlineDate : prev.deadlineDate
      }
      this._save()
      return { ok: true }
    },

    completeTask(id) {
      const idx = this.tasks.findIndex(t => t.id === id)
      if (idx === -1) return { ok: false, error: 'Task not found' }
      if (this.tasks[idx].status === 'done') return { ok: true }

      this.tasks[idx] = {
        ...this.tasks[idx],
        status: 'done',
        completedAt: new Date().toISOString()
      }
      this._save()
      return { ok: true }
    },

    deleteTask(id) {
      const before = this.tasks.length
      this.tasks = this.tasks.filter(t => t.id !== id)
      if (this.tasks.length !== before) {
        this._save()
        return { ok: true }
      }
      return { ok: false, error: 'Task not found' }
    },

    resetAll() {
      this.tasks = []
      this.nextId = 1
      localStorage.removeItem(storageKey('tasks_store'))
    }
  }
})
