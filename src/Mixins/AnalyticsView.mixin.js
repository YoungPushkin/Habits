import { useHabitsStore } from '../stores/habits'
import { useTasksStore } from '../stores/tasks'

export default {
  data() {
    return {
      habitsStore: useHabitsStore(),
      tasksStore: useTasksStore()
    }
  },
  created() {
    this.habitsStore.initFromStorage?.()
    this.tasksStore.initFromStorage?.()
  },
  computed: {
    activeTasksCount() { return this.tasksStore.activeTasks.length },
    completedTasksCount() { return this.tasksStore.completedTasks.length },
    tasksCompletionPercent() { return this.tasksStore.completionPercent },

    highCount() { return this.tasksStore.countsByPriority.high },
    mediumCount() { return this.tasksStore.countsByPriority.medium },
    lowCount() { return this.tasksStore.countsByPriority.low },
    totalActive() { return this.tasksStore.countsByPriority.total },

    highPercent() { return this.totalActive === 0 ? 0 : Math.round((this.highCount / this.totalActive) * 100) },
    mediumPercent() { return this.totalActive === 0 ? 0 : Math.round((this.mediumCount / this.totalActive) * 100) },
    lowPercent() { return this.totalActive === 0 ? 0 : Math.round((this.lowCount / this.totalActive) * 100) },

    weeklyCompleted() { return this.tasksStore.weeklyCompleted },
    mostProductiveDay() { return this.tasksStore.mostProductiveDay },

    monthlyHistory() { return this.tasksStore.monthlyHistory },

    currentStreak() { return this.habitsStore.currentStreak },
    averageWeekly() { return this.habitsStore.averageWeekly }
  },
  methods: {
    barHeight(count) {
      const max = Math.max(...(this.weeklyCompleted || []).map(i => i.count), 1)
      return (count / max) * 100
    },
    monthHeight(count) {
      const max = Math.max(...(this.monthlyHistory || []).map(i => i.count), 1)
      return (count / max) * 100
    }
  }
}
