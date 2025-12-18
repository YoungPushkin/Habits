<script>
import tasksMixin from '../Mixins/TasksView.mixin'
import TaskCard from '../components/TaskCard.vue'
import TaskModal from '../components/TaskModal.vue'

export default {
  name: 'TasksView',
  mixins: [tasksMixin],
  components: { TaskCard, TaskModal }
}
</script>

<template>
  <section class="app-page">
    <div class="page-head">
      <div class="page-title">
        <h1 class="t-h1 text-gold">Tasks</h1>
        <p class="t-sub text-gold">Plan and complete your key actions.</p>
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

    <div v-else>
      <v-card v-if="activeHigh.length" class="card mb-4" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-2">
          <v-chip size="small" variant="tonal" color="error">High priority</v-chip>
          <v-chip size="small" variant="tonal" color="primary">{{ activeHigh.length }} tasks</v-chip>
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-4">
          <div class="stack">
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

      <v-card v-if="activeMedium.length" class="card mb-4" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-2">
          <v-chip size="small" variant="tonal" color="warning">Medium priority</v-chip>
          <v-chip size="small" variant="tonal" color="primary">{{ activeMedium.length }} tasks</v-chip>
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-4">
          <div class="stack">
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

      <v-card v-if="activeLow.length" class="card" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-2">
          <v-chip size="small" variant="tonal" color="info">Low priority</v-chip>
          <v-chip size="small" variant="tonal" color="primary">{{ activeLow.length }} tasks</v-chip>
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-4">
          <div class="stack">
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


