import { useTasksStore } from '../stores/tasks'
import { createEntityActionsMixin } from './EntityActions.mixin'

export default createEntityActionsMixin({
  type: 'task',
  store: useTasksStore,
  storeKey: 'tasksStore',
  methodsPrefix: 'Task',
  actions: {
    add: 'addTask',
    edit: 'editTask',
    delete: 'deleteTask'
  },
  messages: {
    created: 'Task created',
    updated: 'Task updated',
    deleted: 'Task deleted'
  },
  extraMethods: {
    completeTask: {
      action: 'completeTask',
      success: 'Task completed'
    }
  }
})
