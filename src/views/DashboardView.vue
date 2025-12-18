<template>
  <section class="dashboard app-page">
    <div class="page-head">
      <div class="page-title">
        <h1 class="t-h1 text-gold">Today overview</h1>
        <p class="t-sub text-gold">Habits, tasks and progress for your day.</p>
      </div>

      <div class="page-meta">
        <v-chip size="small" variant="tonal" color="primary">
          <span class="t-label" style="margin-right:8px;">Focus mode</span>
          <span class="dot"></span>
          <span style="margin-left:8px;">On</span>
        </v-chip>

        <v-chip size="small" variant="tonal">
          <i class="bi bi-calendar2" style="margin-right:8px;"></i>
          Today
        </v-chip>
      </div>
    </div>

    <div class="stats">
      <v-card class="card" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="t-label">Habits</div>
            <div class="t-label">Day completion</div>
          </div>

          <div class="d-flex align-end ga-3 mb-3">
            <div class="t-value">{{ store.completionPercent }}%</div>
            <div class="t-cap">{{ store.todayDone }} of {{ store.todayTotal }} habits</div>
          </div>

          <v-progress-linear
            :model-value="store.completionPercent"
            height="8"
            rounded
            color="primary"
          />
        </v-card-text>
      </v-card>

      <v-card class="card" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="t-label">Discipline</div>
            <div class="t-label">Best streak</div>
          </div>

          <div class="d-flex align-end ga-3 mb-3">
            <div class="t-value">{{ bestStreak }} days</div>
            <div class="t-cap">Longest chain</div>
          </div>

          <div class="streak">
            <span
              v-for="n in 7"
              :key="n"
              class="streak-dot"
              :style="n <= disciplineDots ? {
                background: 'linear-gradient(90deg,var(--gold),var(--gold2))',
                borderColor: 'rgba(212,175,55,.45)',
                boxShadow: '0 10px 22px rgba(212,175,55,.16)'
              } : null"
            ></span>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="card" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="t-label">Month</div>
            <div class="t-label">Tasks done</div>
          </div>

          <div class="d-flex align-end ga-3 mb-3">
            <div class="t-value">{{ monthTasksDone }}</div>
            <div class="t-cap">{{ monthTasksTotal }} total tasks</div>
          </div>

          <div class="bars">
            <span
              v-for="n in 5"
              :key="n"
              class="bar"
              :class="{ 'is-on': n <= Math.min(4, Math.round(monthTasksPercent / 25)) }"
            />
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div class="middle-row">
      <v-card class="card" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between">
          <div>
            <div class="t-h2">Habits for today</div>
            <p class="t-sub">Keep your promises to yourself.</p>
          </div>

          <div class="d-flex ga-2">
            <v-btn
              icon
              size="small"
              variant="tonal"
              class="btn-icon act-gold"
              :disabled="todayHabitsForUI.length <= 1 || habitsIndex <= 0"
              @click="habitsCarouselPrev"
            >
              <i class="bi bi-chevron-left"></i>
            </v-btn>

            <v-chip v-if="todayHabitsForUI.length" size="small" variant="tonal" color="primary">
              {{ currentHabitNumber }} / {{ todayHabitsForUI.length }}
            </v-chip>

            <v-btn
              icon
              size="small"
              variant="tonal"
              class="btn-icon act-gold"
              :disabled="todayHabitsForUI.length <= 1 || habitsIndex >= todayHabitsForUI.length - 1"
              @click="habitsCarouselNext"
            >
              <i class="bi bi-chevron-right"></i>
            </v-btn>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <div v-if="todayHabitsForUI.length === 0" class="t-body">
            No habits for today
          </div>

          <div v-else>
            <HfCarousel ref="habitsCarousel" :items="todayHabitsForUI" @index="onHabitsIndex">
              <template #default="{ item }">
                <HabitCard
                  :habit="item"
                  :done-today="item.doneToday"
                  :due-today="true"
                  @toggle="toggleHabitDone"
                  @delete="removeHabit"
                  @edit="openEditHabit"
                />
              </template>
            </HfCarousel>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="card" variant="tonal">
        <v-card-title>
          <div>
            <div class="t-h2">Quick actions</div>
            <p class="t-sub">Create new tasks and habits.</p>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text class="d-flex flex-column ga-3">
          <v-btn variant="tonal" rounded="pill" color="primary" @click="openTaskModal">
            <i class="bi bi-plus-lg" style="margin-right:8px;"></i>
            Add task
          </v-btn>

          <v-btn class="btn-primary" color="primary" variant="flat" rounded="pill" @click="openHabitModal">
            <i class="bi bi-plus-lg" style="margin-right:8px;"></i>
            Add habit
          </v-btn>
        </v-card-text>
      </v-card>
    </div>

    <div class="bottom-row">
      <v-card class="card" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-2">
          <div>
            <div class="t-h2">Important timeline</div>
            <p class="t-sub">High priority and near deadlines.</p>
          </div>

          <div class="d-flex ga-2">
            <v-btn
              icon
              size="small"
              variant="tonal"
              class="btn-icon act-gold"
              :disabled="importantTasks.length <= 1 || tasksIndex <= 0"
              @click="tasksCarouselPrev"
            >
              <i class="bi bi-chevron-left"></i>
            </v-btn>

            <v-chip v-if="importantTasks.length" size="small" variant="tonal" color="primary">
              {{ currentTaskNumber }} / {{ importantTasks.length }}
            </v-chip>

            <v-btn
              icon
              size="small"
              variant="tonal"
              class="btn-icon act-gold"
              :disabled="importantTasks.length <= 1 || tasksIndex >= importantTasks.length - 1"
              @click="tasksCarouselNext"
            >
              <i class="bi bi-chevron-right"></i>
            </v-btn>
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

          <div v-else>
            <HfCarousel ref="tasksCarousel" :items="importantTasks" @index="onTasksIndex">
              <template #default="{ item }">
                <TaskCard
                  :task="item"
                  @complete="completeTask"
                  @edit="openEditTask"
                  @delete="deleteTask"
                />
              </template>
            </HfCarousel>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <HabitModal
      v-if="showHabitModal"
      :mode="habitModalMode"
      :habit="selectedHabit"
      @close="onHabitModalClose"
      @save="handleHabitSave"
    />

    <TaskModal
      v-if="showTaskModal"
      :mode="taskModalMode"
      :task="selectedTask"
      @close="onTaskModalClose"
      @save="handleTaskSave"
    />
  </section>
</template>

<script>
import { useHabitsStore } from '../stores/habits'
import { useTasksStore } from '../stores/tasks'
import HabitModal from '../components/HabitModal.vue'
import TaskModal from '../components/TaskModal.vue'
import HabitCard from '../components/HabitCard.vue'
import TaskCard from '../components/TaskCard.vue'
import HfCarousel from '../components/layout/HfCarousel.vue'

export default {
  name: 'DashboardView',
  components: { HabitModal, TaskModal, HabitCard, TaskCard, HfCarousel },
  data() {
    return {
      store: useHabitsStore(),
      tasksStore: useTasksStore(),
      showHabitModal: false,
      habitModalMode: 'create',
      selectedHabit: null,
      showTaskModal: false,
      taskModalMode: 'create',
      selectedTask: null,
      habitsIndex: 0,
      tasksIndex: 0,
      lastISO: '',
      dayTick: null
    }
  },
  created() {
    this.store.initFromStorage?.()
    this.tasksStore.initFromStorage?.()

    this.lastISO = this.store.todayISO
    this.dayTick = setInterval(() => {
      const nowISO = this.store.todayISO
      if (nowISO !== this.lastISO) {
        this.lastISO = nowISO
        this.store.initFromStorage?.()
      } else {
        this.store.ensureTodayBuckets?.()
        this.store.syncTodayCompletion?.()
      }
    }, 60 * 1000)
  },
  beforeUnmount() {
    if (this.dayTick) clearInterval(this.dayTick)
  },
  watch: {
    todayHabitsForUI(list) {
      const max = (Array.isArray(list) ? list.length : 0) - 1
      if (max < 0) this.habitsIndex = 0
      else if (!Number.isFinite(this.habitsIndex) || this.habitsIndex > max) this.habitsIndex = 0
    },
    importantTasks(list) {
      const max = (Array.isArray(list) ? list.length : 0) - 1
      if (max < 0) this.tasksIndex = 0
      else if (!Number.isFinite(this.tasksIndex) || this.tasksIndex > max) this.tasksIndex = 0
    }
  },
  computed: {
    todayHabitsForUI() {
      const map = this.store.todayDoneMap || {}
      return (this.store.todayHabits || []).map(h => ({
        ...h,
        doneToday: !!map[h.id]
      }))
    },
    disciplineDots() {
      const total = Number(this.store?.todayTotal || 0)
      const done = Number(this.store?.todayDone || 0)
      if (total === 0) return 0
      const dots = Math.round((done / total) * 7)
      return Math.min(7, Math.max(0, dots))
    },
    bestStreak() {
      return this.store?.bestStreak || 0
    },
    currentHabitNumber() {
      const idx = Number(this.habitsIndex)
      return Number.isFinite(idx) ? idx + 1 : 1
    },
    currentTaskNumber() {
      const idx = Number(this.tasksIndex)
      return Number.isFinite(idx) ? idx + 1 : 1
    },
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
    onHabitsIndex(i) {
      const idx = Number(i)
      if (Number.isFinite(idx)) this.habitsIndex = idx
    },
    onTasksIndex(i) {
      const idx = Number(i)
      if (Number.isFinite(idx)) this.tasksIndex = idx
    },

    toggleHabitDone(id) {
      this.store.toggleHabitDoneToday(id)
      this.store.initFromStorage?.()
    },
    removeHabit(id) {
      this.store.deleteHabit(id)
      this.store.initFromStorage?.()
    },
    openHabitModal() {
      this.habitModalMode = 'create'
      this.selectedHabit = null
      this.showHabitModal = true
    },
    openEditHabit(habit) {
      this.habitModalMode = 'edit'
      this.selectedHabit = { ...habit }
      this.showHabitModal = true
    },
    onHabitModalClose() {
      this.showHabitModal = false
      this.selectedHabit = null
      this.store.initFromStorage?.()
    },
    handleHabitSave(payload) {
      if (this.habitModalMode === 'create') this.store.addHabit(payload)
      else if (this.selectedHabit) this.store.editHabit(this.selectedHabit.id, payload)
      this.onHabitModalClose()
    },

    openTaskModal() {
      this.taskModalMode = 'create'
      this.selectedTask = null
      this.showTaskModal = true
    },
    onTaskModalClose() {
      this.showTaskModal = false
      this.selectedTask = null
      this.tasksStore?.initFromStorage?.()
    },
    openEditTask(task) {
      this.taskModalMode = 'edit'
      this.selectedTask = { ...task }
      this.showTaskModal = true
    },
    handleTaskSave(payload) {
      if (this.taskModalMode === 'create') this.tasksStore?.addTask?.(payload)
      else if (this.selectedTask) this.tasksStore?.editTask?.(this.selectedTask.id, payload)
      this.onTaskModalClose()
    },
    completeTask(id) {
      this.tasksStore?.completeTask?.(id)
      this.tasksStore?.initFromStorage?.()
    },
    deleteTask(id) {
      this.tasksStore?.deleteTask?.(id)
      this.tasksStore?.initFromStorage?.()
    },

    habitsCarouselPrev() {
      if (this.habitsIndex <= 0) return
      const c = this.$refs.habitsCarousel
      if (c && c.prev) c.prev()
      this.habitsIndex -= 1
    },
    habitsCarouselNext() {
      const max = (this.todayHabitsForUI?.length || 0) - 1
      if (this.habitsIndex >= max) return
      const c = this.$refs.habitsCarousel
      if (c && c.next) c.next()
      this.habitsIndex += 1
    },

    tasksCarouselPrev() {
      if (this.tasksIndex <= 0) return
      const c = this.$refs.tasksCarousel
      if (c && c.prev) c.prev()
      this.tasksIndex -= 1
    },
    tasksCarouselNext() {
      const max = (this.importantTasks?.length || 0) - 1
      if (this.tasksIndex >= max) return
      const c = this.$refs.tasksCarousel
      if (c && c.next) c.next()
      this.tasksIndex += 1
    }
  }
}
</script>
