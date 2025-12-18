import { useHabitsStore } from '../stores/habits'

export default {
  data() {
    return {
      store: useHabitsStore(),
      showHabitModal: false,
      habitModalMode: 'create',
      selectedHabit: null
    }
  },
  created() {
    this.store.initFromStorage?.()
  },
  computed: {
    habitsUI() {
      return this.store.habitsUI
    }
  },
  methods: {
    openCreateHabit() {
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
    toggleHabit(id) {
      this.store.toggleHabitDoneToday(id)
    },
    deleteHabit(id) {
      this.store.deleteHabit(id)
      if (this.selectedHabit && this.selectedHabit.id === id) this.onHabitModalClose()
    }
  }
}
