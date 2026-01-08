import { useHabitsStore } from '../stores/habits'
import { createEntityActionsMixin } from './EntityActions.mixin'

export default createEntityActionsMixin({
  type: 'habit',
  store: useHabitsStore,
  storeKey: 'habitsStore',
  methodsPrefix: 'Habit',
  actions: {
    add: 'addHabit',
    edit: 'editHabit',
    delete: 'deleteHabit'
  },
  messages: {
    created: 'Habit created',
    updated: 'Habit updated',
    deleted: 'Habit deleted'
  },
  toggle: {
    name: 'toggleHabit',
    action: 'toggleHabitDoneToday',
    success: (res) => (res.done ? 'Marked as done for today' : 'Marked as not done')
  }
})
