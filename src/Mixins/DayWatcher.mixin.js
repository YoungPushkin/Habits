import { useHabitsStore } from '../stores/habits'
import { useTasksStore } from '../stores/tasks'

let dayWatcherStarted = false
let dayWatcherTimer = null

export default {
  data() {
    return {
    
      _dayWatcherLocalStarted: false
    }
  },

  created() {
    if (dayWatcherStarted) return

    const habitsStore = useHabitsStore()
    const tasksStore = useTasksStore()

    dayWatcherStarted = true
    this._dayWatcherLocalStarted = true

    let lastISO = habitsStore.todayISO

    dayWatcherTimer = setInterval(() => {
      const nowISO = habitsStore.todayISO

      if (nowISO !== lastISO) {
        lastISO = nowISO
        habitsStore.initFromStorage?.()
        tasksStore.initFromStorage?.()
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
