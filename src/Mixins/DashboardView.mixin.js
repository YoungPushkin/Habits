import { useHabitsStore } from '../stores/habits'
import { useTasksStore } from '../stores/tasks'

export default {
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
      return this.store.todayHabitsForUI
    },
    bestStreak() {
      return this.store.bestStreak || 0
    },
    disciplineDots() {
      const total = Number(this.store?.todayTotal || 0)
      const done = Number(this.store?.todayDone || 0)
      if (total === 0) return 0
      const dots = Math.round((done / total) * 7)
      return Math.min(7, Math.max(0, dots))
    },

    monthTasksTotal() {
      return this.tasksStore.monthStats.total
    },
    monthTasksDone() {
      return this.tasksStore.monthStats.done
    },
    monthTasksPercent() {
      return this.tasksStore.monthStats.percent
    },

    importantTasks() {
      return this.tasksStore.importantTasks
    },

    currentHabitNumber() {
      const idx = Number(this.habitsIndex)
      return Number.isFinite(idx) ? idx + 1 : 1
    },
    currentTaskNumber() {
      const idx = Number(this.tasksIndex)
      return Number.isFinite(idx) ? idx + 1 : 1
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
    },
    removeHabit(id) {
      this.store.deleteHabit(id)
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
    openEditTask(task) {
      this.taskModalMode = 'edit'
      this.selectedTask = { ...task }
      this.showTaskModal = true
    },
    onTaskModalClose() {
      this.showTaskModal = false
      this.selectedTask = null
    },
    handleTaskSave(payload) {
      if (this.taskModalMode === 'create') this.tasksStore.addTask(payload)
      else if (this.selectedTask) this.tasksStore.editTask(this.selectedTask.id, payload)
      this.onTaskModalClose()
    },

    completeTask(id) {
      this.tasksStore.completeTask(id)
    },
    deleteTask(id) {
      this.tasksStore.deleteTask(id)
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
