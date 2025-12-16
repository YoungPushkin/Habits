<template>
  <section class="tasks app-page">
    <div class="page-header">
      <div class="page-title">
        <h1 class="t-h1">Tasks</h1>
        <p class="t-subtitle">Plan and complete your key actions.</p>
      </div>

      <div class="page-actions">
        <v-btn variant="tonal" rounded="pill" color="primary" @click="openCreate">
          <i class="bi bi-plus-lg" style="margin-right:8px;"></i>
          Add task
        </v-btn>
      </div>
    </div>

    <v-alert
      v-if="!hasActive"
      type="info"
      variant="tonal"
      density="comfortable"
      class="mt-3"
    >
      You have no active tasks yet. Create your first task to start moving forward.
    </v-alert>

    <div v-else class="task-groups">
      <v-card v-if="activeHigh.length" class="hf-card mb-4" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-2">
          <v-chip size="small" variant="tonal" color="error">High priority</v-chip>
          <v-chip size="small" variant="tonal" color="primary">{{ activeHigh.length }} tasks</v-chip>
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-4">
          <div class="task-group-body">
            <TaskCard
              v-for="t in activeHigh"
              :key="t.id"
              :task="t"
              @complete="completeTask"
              @edit="openEdit"
              @delete="deleteTask"
            />
          </div>
        </v-card-text>
      </v-card>

      <v-card v-if="activeMedium.length" class="hf-card mb-4" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-2">
          <v-chip size="small" variant="tonal" color="warning">Medium priority</v-chip>
          <v-chip size="small" variant="tonal" color="primary">{{ activeMedium.length }} tasks</v-chip>
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-4">
          <div class="task-group-body">
            <TaskCard
              v-for="t in activeMedium"
              :key="t.id"
              :task="t"
              @complete="completeTask"
              @edit="openEdit"
              @delete="deleteTask"
            />
          </div>
        </v-card-text>
      </v-card>

      <v-card v-if="activeLow.length" class="hf-card" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-2">
          <v-chip size="small" variant="tonal" color="info">Low priority</v-chip>
          <v-chip size="small" variant="tonal" color="primary">{{ activeLow.length }} tasks</v-chip>
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-4">
          <div class="task-group-body">
            <TaskCard
              v-for="t in activeLow"
              :key="t.id"
              :task="t"
              @complete="completeTask"
              @edit="openEdit"
              @delete="deleteTask"
            />
          </div>
        </v-card-text>
      </v-card>
    </div>

    <TaskModal
      v-if="showTaskModal"
      :mode="taskModalMode"
      :task="selectedTask"
      @close="onTaskModalClose"
      @save="handleTaskSave"
    />
  </section>
</template>

<script>
import TaskCard from '../components/layout/TaskCard.vue'
import TaskModal from '../components/layout/TaskModal.vue'
import { useTasksStore } from '../stores/tasks.js'

export default {
  name: 'TasksView',
  components: { TaskCard, TaskModal },
  data() {
    return {
      store: null,
      showTaskModal: false,
      taskModalMode: 'create',
      selectedTask: null
    }
  },
  created() {
    this.store = useTasksStore()
    this.store.initFromStorage?.()
  },
  computed: {
    hasActive() {
      return !!this.store?.hasActive
    },
    activeHigh() {
      return this.store?.activeHigh || []
    },
    activeMedium() {
      return this.store?.activeMedium || []
    },
    activeLow() {
      return this.store?.activeLow || []
    }
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
      this.store?.initFromStorage?.()
    },
    handleTaskSave(payload) {
      if (!this.store) return
      if (this.taskModalMode === 'create') {
        this.store.addTask(payload)
      } else if (this.selectedTask) {
        this.store.editTask(this.selectedTask.id, payload)
      }
      this.onTaskModalClose()
    },
    completeTask(id) {
      this.store?.completeTask?.(id)
    },
    deleteTask(id) {
      this.store?.deleteTask?.(id)
    }
  }
}
</script>

<style scoped>
.task-group-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
