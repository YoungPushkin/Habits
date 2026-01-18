<template>
  <v-card class="card" variant="tonal">
    <v-card-text class="task-row">
      <div class="task-main">
        <div class="task-title-group">
          <span class="item-title">{{ task.title }}</span>

          <BaseChip size="x-small" variant="tonal" :color="priorityColor">
            {{ task.priority }}
          </BaseChip>
        </div>
      </div>

      <BaseChip size="small" variant="tonal" :color="deadlineColor">
        <i class="bi bi-calendar2" style="margin-right:8px"></i>
        <span>{{ deadlineText }}</span>
      </BaseChip>

      <div class="task-actions">
        <BaseButton
          kind="action"
          rounded="lg"
          class="act-ok"
          @click="$emit('complete', task.id)"
        >
          <i class="bi bi-check2" style="margin-right:8px"></i>
          {{ buttonLabels.complete }}
        </BaseButton>

        <EditDeleteMenu @edit="onEdit" @delete="onDelete" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import BaseButton from './global/BaseButton.vue'
import BaseChip from './global/BaseChip.vue'
import EditDeleteMenu from './global/EditDeleteMenu.vue'
import { BUTTON_LABELS } from '../constants/buttons.js'
import { parseISODate, formatISODate } from '../utils/date.js'

export default {
  name: 'TaskCard',
  components: { BaseButton, BaseChip, EditDeleteMenu },
  props: {
    task: { type: Object, required: true }
  },
  emits: ['complete', 'edit', 'delete'],
  computed: {
    buttonLabels() { return BUTTON_LABELS },
    deadlineText() {
      if (!this.task.deadlineDate) return 'No deadline'
      const text = formatISODate(this.task.deadlineDate)
      return text || 'No deadline'
    },
    deadlineDiff() {
      if (!this.task.deadlineDate) return null
      const due = parseISODate(this.task.deadlineDate)
      if (!due) return null
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
.item-title{
  font-size:15px;
  font-weight:500;
  color:var(--text);
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
