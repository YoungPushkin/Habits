<template>
  <v-card class="hf-item-card task-card">
    <v-card-text class="d-flex align-center justify-space-between ga-4 flex-wrap">
      <div class="d-flex align-center ga-3 min-w-0">
        <div class="d-flex align-center ga-2 flex-wrap">
          <span class="task-title">{{ task.title }}</span>

          <v-chip
            size="x-small"
            variant="tonal"
            :color="priorityColor"
          >
            {{ task.priority }}
          </v-chip>
        </div>
      </div>

      <v-chip
        size="small"
        variant="tonal"
        :color="deadlineColor"
      >
        <i class="bi bi-calendar2"></i>
        <span>{{ deadlineText }}</span>
      </v-chip>

      <div class="d-flex align-center ga-2">
        <v-btn
          variant="tonal"
          rounded="lg"
          class="hf-action-btn hf-action-success"
          @click="$emit('complete', task.id)"
        >
          <i class="bi bi-check2"></i>
          Complete
        </v-btn>

        <v-menu location="bottom end">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="tonal"
              size="small"
              class="hf-action-icon"
            >
              <i class="bi bi-three-dots-vertical"></i>
            </v-btn>
          </template>

          <v-list density="comfortable" class="hf-menu">
            <v-list-item @click="onEdit">
              <template #prepend>
                <i class="bi bi-pencil hf-action-primary"></i>
              </template>
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>

            <v-list-item class="task-danger" @click="onDelete">
              <template #prepend>
                <i class="bi bi-trash hf-action-danger"></i>
              </template>
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'TaskCard',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  emits: ['complete', 'edit', 'delete'],
  computed: {
    deadlineText() {
      if (!this.task.deadlineDate) return 'No deadline'
      const d = new Date(this.task.deadlineDate + 'T00:00:00')
      if (isNaN(d.getTime())) return 'No deadline'
      return d.toLocaleDateString()
    },
    deadlineDiff() {
      if (!this.task.deadlineDate) return null
      const due = new Date(this.task.deadlineDate + 'T00:00:00')
      if (isNaN(due.getTime())) return null
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return Math.round((due - today) / (1000 * 60 * 60 * 24))
    },
    deadlineColor() {
      if (this.deadlineDiff === null) return undefined
      if (this.deadlineDiff < 0) return 'error'
      if (this.deadlineDiff <= 1) return 'warning'
      return 'success'
    },
    priorityColor() {
      if (this.task.priority === 'high') return 'error'
      if (this.task.priority === 'medium') return 'warning'
      if (this.task.priority === 'low') return 'info'
      return undefined
    }
  },
  methods: {
    onEdit() {
      this.$emit('edit', this.task)
    },
    onDelete() {
      this.$emit('delete', this.task.id)
    }
  }
}
</script>
