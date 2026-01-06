import { useUiStore } from '../stores/settings.js'
import { useUsersStore } from '../stores/users.js'
import { useHabitsStore } from '../stores/habits.js'
import { useTasksStore } from '../stores/tasks.js'

export function initAllStores() {
  const ui = useUiStore()
  const users = useUsersStore()
  const habits = useHabitsStore()
  const tasks = useTasksStore()

  ui.initFromStorage?.()
  users.load?.()
  users.loadCurrentUser?.()
  habits.initFromStorage?.()
  tasks.initFromStorage?.()
}

export function resetAllStores() {
  const ui = useUiStore()
  const users = useUsersStore()
  const habits = useHabitsStore()
  const tasks = useTasksStore()

  habits.resetAll?.()
  tasks.resetAll?.()
  ui.resetAll?.()
  users.logout?.()

  localStorage.removeItem('current_user_name')
}
