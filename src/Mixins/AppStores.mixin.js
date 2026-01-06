import { useHabitsStore } from '../stores/habits'
import { useTasksStore } from '../stores/tasks'
import { useUsersStore } from '../stores/users'

export default {
  data() {
    return {
      habitsStore: useHabitsStore(),
      tasksStore: useTasksStore(),
      usersStore: useUsersStore()
    }
  }
}
