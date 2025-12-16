<template>
  <section class="dashboard app-page">
    <div class="page-header">
      <div class="page-title">
        <h1 class="t-h1">Today overview</h1>
        <p class="t-subtitle">Habits, tasks and progress for your day.</p>
      </div>

      <div class="page-meta">
        <v-chip size="small" variant="tonal" color="primary">
          <span class="t-label" style="margin-right:8px;">Focus mode</span>
          <span class="hf-dot"></span>
          <span style="margin-left:8px;">On</span>
        </v-chip>

        <v-chip size="small" variant="tonal">
          <i class="bi bi-calendar2" style="margin-right:8px;"></i>
          Today
        </v-chip>
      </div>
    </div>

    <div class="stats-row">
      <v-card class="hf-card" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="t-label">Habits</div>
            <div class="t-label">Day completion</div>
          </div>

          <div class="d-flex align-end ga-3 mb-3">
            <div class="t-value">{{ store.completionPercent }}%</div>
            <div class="t-caption">{{ store.todayDone }} of {{ store.todayTotal }} habits</div>
          </div>

          <v-progress-linear
            :model-value="store.completionPercent"
            height="8"
            rounded
            color="primary"
          />
        </v-card-text>
      </v-card>

      <v-card class="hf-card" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="t-label">Discipline</div>
            <div class="t-label">Best streak</div>
          </div>

          <div class="d-flex align-end ga-3 mb-3">
            <div class="t-value">{{ bestStreak }} days</div>
            <div class="t-caption">Longest chain</div>
          </div>

          <div class="hf-streak">
            <span
              v-for="n in 7"
              :key="n"
              class="hf-streak-dot"
              :class="{ active: n <= bestStreakDisplay }"
            />
          </div>
        </v-card-text>
      </v-card>

      <v-card class="hf-card" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="t-label">Month</div>
            <div class="t-label">Tasks done</div>
          </div>

          <div class="d-flex align-end ga-3 mb-3">
            <div class="t-value">{{ monthTasksDone }}</div>
            <div class="t-caption">{{ monthTasksTotal }} total tasks</div>
          </div>

          <div class="hf-bars">
            <span
              v-for="n in 5"
              :key="n"
              class="hf-bar"
              :class="{ active: n <= Math.min(4, Math.round(monthTasksPercent / 25)) }"
            />
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div class="middle-row">
      <v-card class="hf-card" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between">
          <div>
            <div class="t-h2">Habits for today</div>
            <div class="t-subtitle">Keep your promises to yourself.</div>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-list lines="two" class="hf-list" density="comfortable">
            <v-list-item v-if="store.habits.length === 0">
              <v-list-item-title class="t-body">No habits yet</v-list-item-title>
            </v-list-item>

            <v-list-item v-for="h in store.habits" :key="h.id">
              <template #prepend>
                <v-btn
                  icon
                  size="small"
                  variant="tonal"
                  color="primary"
                  @click="toggleHabitDone(h.id)"
                >
                  <i v-if="h.doneToday" class="bi bi-check-lg"></i>
                  <i v-else class="bi bi-circle"></i>
                </v-btn>
              </template>

              <v-list-item-title class="t-body">{{ h.name }}</v-list-item-title>
              <v-list-item-subtitle class="t-caption">{{ h.meta }}</v-list-item-subtitle>

              <template #append>
                <div class="d-flex align-center ga-2">
                  <v-btn
                    size="small"
                    variant="tonal"
                    color="primary"
                    @click="removeHabit(h.id)"
                  >
                    Remove
                  </v-btn>

                  <v-chip
                    size="small"
                    variant="tonal"
                    :color="h.doneToday ? 'success' : 'warning'"
                  >
                    {{ h.doneToday ? 'Done' : 'Pending' }}
                  </v-chip>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <v-card class="hf-card" variant="tonal">
        <v-card-title>
          <div>
            <div class="t-h2">Quick actions</div>
            <div class="t-subtitle">Create new tasks and habits.</div>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text class="d-flex flex-column ga-3">
          <v-btn color="primary" variant="flat" rounded="pill" @click="openTaskModal">
            <i class="bi bi-clipboard-plus" style="margin-right:10px;"></i>
            Add task
          </v-btn>

          <v-btn color="primary" variant="tonal" rounded="pill" @click="openHabitModal">
            <i class="bi bi-plus-lg" style="margin-right:10px;"></i>
            Add habit
          </v-btn>
        </v-card-text>
      </v-card>
    </div>

    <div class="bottom-row">
      <v-card class="hf-card" variant="tonal">
        <v-card-title>
          <div>
            <div class="t-h2">Important timeline</div>
            <div class="t-subtitle">High priority and near deadlines.</div>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-alert
            v-if="!importantTasks.length"
            type="info"
            variant="tonal"
            density="comfortable"
          >
            No important tasks right now.
          </v-alert>

          <v-list v-else density="comfortable" class="hf-list">
            <v-list-item v-for="t in importantTasks" :key="t.id">
              <v-list-item-title class="t-body">{{ t.title }}</v-list-item-title>

              <template #append>
                <div class="d-flex align-center ga-2">
                  <v-chip
                    size="small"
                    variant="tonal"
                    :class="priorityClass(t.priority)"
                  >
                    {{ priorityLabel(t.priority) }}
                  </v-chip>

                  <v-chip
                    size="small"
                    variant="tonal"
                    :class="deadlineChipClass(t)"
                  >
                    {{ deadlineText(t) }}
                  </v-chip>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </div>

    <HabitModal
      v-if="showHabitModal"
      @close="onHabitModalClose"
      @save="handleHabitSave"
    />

    <TaskModal
      v-if="showTaskModal"
      @close="onTaskModalClose"
      @save="handleTaskSave"
    />
  </section>
</template>

<script>
import { useHabitsStore } from '../stores/habits'
import { useTasksStore } from '../stores/tasks'
import HabitModal from '../components/layout/HabitModal.vue'
import TaskModal from '../components/layout/TaskModal.vue'

export default {
  name: 'DashboardView',
  components: { HabitModal, TaskModal },
  data() {
    return {
      store: useHabitsStore(),
      tasksStore: useTasksStore(),
      showHabitModal: false,
      showTaskModal: false
    }
  },
  created() {
    this.store.initFromStorage?.()
    this.tasksStore.initFromStorage?.()
  },
  computed: {
    monthTasksTotal() {
      const tasks = this.tasksStore?.tasks || []
      const now = new Date()
      const y = now.getFullYear()
      const m = now.getMonth()
      return tasks.filter(t => {
        if (!t.deadlineDate) return false
        const d = new Date(t.deadlineDate + 'T00:00:00')
        return d.getFullYear() === y && d.getMonth() === m
      }).length
    },
    monthTasksDone() {
      const tasks = this.tasksStore?.tasks || []
      const now = new Date()
      const y = now.getFullYear()
      const m = now.getMonth()
      return tasks.filter(t => {
        if (!t.deadlineDate) return false
        const d = new Date(t.deadlineDate + 'T00:00:00')
        return d.getFullYear() === y && d.getMonth() === m && t.status === 'done'
      }).length
    },
    monthTasksPercent() {
      if (!this.monthTasksTotal) return 0
      return Math.round((this.monthTasksDone / this.monthTasksTotal) * 100)
    },
    bestStreak() {
      return this.store?.bestStreak || 0
    },
    bestStreakDisplay() {
      return Math.min(7, this.bestStreak || 0)
    },
    importantTasks() {
      const tasks = this.tasksStore?.tasks || []
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      return tasks
        .filter(t => t.status === 'active' && t.deadlineDate)
        .map(t => {
          const due = new Date(t.deadlineDate + 'T00:00:00')
          const diff = Math.round((due - today) / (1000 * 60 * 60 * 24))
          return { ...t, _diff: diff }
        })
        .filter(t => t.priority === 'high' || t._diff <= 3)
        .sort((a, b) => {
          if (a.priority === 'high' && b.priority !== 'high') return -1
          if (a.priority !== 'high' && b.priority === 'high') return 1
          return a._diff - b._diff
        })
    }
  },
  methods: {
    toggleHabitDone(id) { this.store?.toggleHabit?.(id) },
    removeHabit(id) { this.store?.deleteHabit?.(id) },
    openHabitModal() { this.showHabitModal = true },
    openTaskModal() { this.showTaskModal = true },
    onHabitModalClose() { this.showHabitModal = false; this.store?.initFromStorage?.() },
    onTaskModalClose() { this.showTaskModal = false; this.tasksStore?.initFromStorage?.() },
    handleTaskSave(payload) { this.tasksStore?.addTask?.(payload); this.onTaskModalClose() },
    handleHabitSave(payload) {
      this.store?.addHabit?.(payload.name, '', 'custom', payload.category, payload.isDaily, payload.days)
      this.onHabitModalClose()
    },
    priorityLabel(p) {
      if (p === 'high') return 'High'
      if (p === 'medium') return 'Medium'
      if (p === 'low') return 'Low'
      return 'Task'
    },
    priorityClass(p) {
      if (p === 'high') return 'hf-priority-high'
      if (p === 'medium') return 'hf-priority-medium'
      return 'hf-priority-low'
    },
    deadlineChipClass(t) {
      const diff = typeof t._diff === 'number' ? t._diff : this.diffDays(t.deadlineDate)
      if (isNaN(diff)) return 'hf-deadline-normal'
      if (diff < 0) return 'hf-deadline-overdue'
      if (diff <= 2) return 'hf-deadline-soon'
      return 'hf-deadline-normal'
    },
    deadlineText(t) {
      const diff = typeof t._diff === 'number' ? t._diff : this.diffDays(t.deadlineDate)
      if (isNaN(diff)) return 'No deadline'
      if (diff < 0) return `Overdue ${Math.abs(diff)} d`
      if (diff === 0) return 'Today'
      return `In ${diff} d`
    },
    diffDays(dateStr) {
      if (!dateStr) return NaN
      const due = new Date(dateStr + 'T00:00:00')
      if (isNaN(due.getTime())) return NaN
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return Math.round((due - today) / (1000 * 60 * 60 * 24))
    }
  }
}
</script>
