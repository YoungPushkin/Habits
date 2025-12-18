import { defineStore } from 'pinia'

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    nextId: 1
  }),

  getters: {
    hasActive(state) {
      return state.tasks.some(t => t.status === 'active')
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
    activeTasks(state) {
      return state.tasks.filter(t => t.status === 'active')
    },
    completedTasks(state) {
      return state.tasks.filter(t => t.status === 'done')
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

            // ✅ МИГРАЦИЯ: если задача уже done, но completedAt пустой — заполняем
            let completedAt = t.completedAt || ''
            if (status === 'done' && !completedAt) {
              completedAt = t.deadlineDate || todayISO()
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

          // ✅ сохраним миграцию обратно в localStorage
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
      t.completedAt = todayISO() // ✅ история выполнений

      this.saveToStorage()
    }
  }
})
