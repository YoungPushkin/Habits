import { useHabitsStore } from '../stores/habits'
import { useTasksStore } from '../stores/tasks'

let dayWatcherStarted = false
let dayWatcherTimer = null

export default {
  created() {
    if (dayWatcherStarted) return

    const habitsStore = useHabitsStore()
    const tasksStore = useTasksStore()

    dayWatcherStarted = true

    let lastISO = habitsStore.todayISO

    // ensure discipline stats (streaks/completion) are in sync on load
    habitsStore.ensureTodayBuckets?.()
    habitsStore.syncTodayCompletion?.()

    dayWatcherTimer = setInterval(() => {
      const nowISO = habitsStore.todayISO

      if (nowISO !== lastISO) {
        lastISO = nowISO
        habitsStore.initFromStorage?.()
        tasksStore.initFromStorage?.()
        habitsStore.ensureTodayBuckets?.()
        habitsStore.syncTodayCompletion?.()
      } else {
        habitsStore.ensureTodayBuckets?.()
        habitsStore.syncTodayCompletion?.()
      }
    }, 60 * 1000)
  },

  beforeUnmount() {
    if (dayWatcherTimer) {
      clearInterval(dayWatcherTimer)
      dayWatcherTimer = null
      dayWatcherStarted = false
    }
  }
}
