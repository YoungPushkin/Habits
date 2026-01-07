<template>
  <v-card class="card" variant="tonal">
    <v-card-text class="task-row">
      <div class="task-main">
        <div class="task-title-group">
          <span class="item-title">{{ task.title }}</span>

          <v-chip size="x-small" variant="tonal" :color="priorityColor">
            {{ task.priority }}
          </v-chip>
        </div>
      </div>

      <v-chip size="small" variant="tonal" :color="deadlineColor">
        <i class="bi bi-calendar2" style="margin-right:8px"></i>
        <span>{{ deadlineText }}</span>
      </v-chip>

      <div class="task-actions">
        <v-btn
          variant="tonal"
          rounded="lg"
          class="btn-action act-ok"
          @click="$emit('complete', task.id)"
        >
          <i class="bi bi-check2" style="margin-right:8px"></i>
          Complete
        </v-btn>

        <v-menu location="bottom end">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="tonal"
              size="small"
              class="btn-icon"
            >
              <i class="bi bi-three-dots-vertical"></i>
            </v-btn>
          </template>

          <v-list density="comfortable" class="menu">
            <v-list-item @click="onEdit">
              <template #prepend>
                <i class="bi bi-pencil act-gold"></i>
              </template>
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>

            <v-list-item class="bad" @click="onDelete">
              <template #prepend>
                <i class="bi bi-trash act-bad"></i>
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
    task: { type: Object, required: true }
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
    onEdit() { this.$emit('edit', this.task) },
    onDelete() { this.$emit('delete', this.task.id) }
  }
}
</script>

<style scoped>
.menu{
  min-width:180px;
  border-radius:var(--r-md);
  border:1px solid var(--border2);
  background:rgba(11,11,11,.92);
  backdrop-filter:blur(14px);
}

.item-title{
  font-size:15px;
  font-weight:500;
  color:var(--text);
}

.bad :deep(.v-list-item-title),
.bad i{
  color:#ef4444;
}

.task-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  flex-wrap:wrap;
}
.task-main{
  display:flex;
  align-items:center;
  gap:12px;
  min-width:0;
}
.task-title-group{
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
}
.task-actions{
  display:flex;
  align-items:center;
  gap:8px;
}
</style>
