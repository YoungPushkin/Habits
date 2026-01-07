import EntityModalMixin from './EntityModal.mixin'
import { useHabitsStore } from '../stores/habits'
import { useUiStore } from '../stores/settings'

export default {
  mixins: [EntityModalMixin],
  data() {
    return {
      ui: useUiStore(),
      habitsStore: useHabitsStore()
    }
  },

  methods: {
    openHabitCreate() {
      this.openCreate('habit')
    },

    openHabitEdit(habit) {
      this.openEdit('habit', habit)
    },

    submitHabit(payload) {
      if (!payload) return

      if (this.modalMode === 'create') {
        const res = this.habitsStore.addHabit(payload)
        if (res?.ok) this.ui.showToast('Habit created', 'success')
        else if (res && res.error) this.ui.showToast(res.error, 'error')
      } else if (this.selectedItem) {
        const res = this.habitsStore.editHabit(this.selectedItem.id, payload)
        if (res?.ok) this.ui.showToast('Habit updated', 'success')
        else if (res && res.error) this.ui.showToast(res.error, 'error')
      }

      this.closeModal()
    },

    toggleHabit(id) {
      const res = this.habitsStore.toggleHabitDoneToday(id)
      if (res?.ok) {
        const msg = res.done ? 'Marked as done for today' : 'Marked as not done'
        this.ui.showToast(msg, 'success')
      }
      else if (res && res.error) this.ui.showToast(res.error, 'error')
    },

    deleteHabit(id) {
      const res = this.habitsStore.deleteHabit(id)
      if (res?.ok) this.ui.showToast('Habit deleted', 'success')
      else if (res && res.error) this.ui.showToast(res.error, 'error')
      if (this.selectedItem && this.selectedItem.id === id) this.closeModal()
    }
  }
}
