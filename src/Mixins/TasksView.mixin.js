import { useTasksStore } from '../stores/tasks'

export default {
  data() {
    return {
      store: useTasksStore(),
      showTaskModal: false,
      taskModalMode: 'create',
      selectedTask: null
    }
  },
  created() {
    this.store.initFromStorage?.()
  },
  computed: {
    hasActive() { return this.store.hasActive },
    activeHigh() { return this.store.activeHigh },
    activeMedium() { return this.store.activeMedium },
    activeLow() { return this.store.activeLow }
  },
  methods: {
    openCreate() {
      this.taskModalMode = 'create'
      this.selectedTask = null
      this.showTaskModal = true
    },
    openEdit(task) {
      this.taskModalMode = 'edit'
      this.selectedTask = { ...task }
      this.showTaskModal = true
    },
    onTaskModalClose() {
      this.showTaskModal = false
      this.selectedTask = null
    },
    handleTaskSave(payload) {
      if (this.taskModalMode === 'create') this.store.addTask(payload)
      else if (this.selectedTask) this.store.editTask(this.selectedTask.id, payload)
      this.onTaskModalClose()
    },
    completeTask(id) { this.store.completeTask(id) },
    deleteTask(id) { this.store.deleteTask(id) }
  }
}
