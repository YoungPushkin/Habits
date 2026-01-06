import EntityModalMixin from './EntityModal.mixin'
import { useTasksStore } from '../stores/tasks'
import { useUiStore } from '../stores/settings'

export default {
  mixins: [EntityModalMixin],
  data() {
    return {
      ui: useUiStore(),
      tasksStore: useTasksStore()
    }
  },

  methods: {
    openTaskCreate() {
      this.openCreate('task')
    },

    openTaskEdit(task) {
      this.openEdit('task', task)
    },

    submitTask(payload) {
      if (!payload) return

      if (this.modalMode === 'create') {
        const res = this.tasksStore.addTask(payload)
        if (res?.ok) this.ui.showToast('Task created', 'success')
        else if (res && res.error) this.ui.showToast(res.error, 'error')
      } else if (this.selectedItem) {
        const res = this.tasksStore.editTask(this.selectedItem.id, payload)
        if (res?.ok) this.ui.showToast('Task updated', 'success')
        else if (res && res.error) this.ui.showToast(res.error, 'error')
      }

      this.closeModal()
    },

    completeTask(id) {
      const res = this.tasksStore.completeTask(id)
      if (res?.ok) this.ui.showToast('Task completed', 'success')
      else if (res && res.error) this.ui.showToast(res.error, 'error')
    },

    deleteTask(id) {
      const res = this.tasksStore.deleteTask(id)
      if (res?.ok) this.ui.showToast('Task deleted', 'success')
      else if (res && res.error) this.ui.showToast(res.error, 'error')
      if (this.selectedItem && this.selectedItem.id === id) this.closeModal()
    }
  }
}
