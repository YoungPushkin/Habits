<template>
  <v-card class="hf-item-card habit-card">
    <v-card-title class="d-flex align-center justify-space-between ga-3">
      <div class="d-flex align-center ga-2 min-w-0">
        <span class="habit-dot" :style="{ backgroundColor: categoryColor }"></span>
        <span class="t-label">{{ categoryLabel }}</span>
      </div>

      <div class="d-flex align-center ga-2">
        <v-chip
          size="small"
          :color="habit.doneToday ? 'success' : 'warning'"
          variant="tonal"
        >
          {{ habit.doneToday ? 'Done today' : 'Pending' }}
        </v-chip>

        <v-menu location="bottom end" :close-on-content-click="true">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              size="small"
              variant="tonal"
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

            <v-list-item class="hf-danger" @click="onDelete">
              <template #prepend>
                <i class="bi bi-trash hf-action-danger"></i>
              </template>
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text class="pt-4">
      <div class="d-flex align-center justify-space-between ga-3">
        <v-list-item class="px-0" lines="two">
          <template #prepend>
            <v-checkbox-btn class="btn"
              :model-value="habit.doneToday"
              @update:model-value="toggle"
            />
          </template>

          <template #title>
            <span class="t-body habit-name">{{ habit.name }}</span>
          </template>

          <template #subtitle>
            <span v-if="habit.createdAt" class="t-caption">
            </span>
          </template>
        </v-list-item>
      </div>

      <div class="d-flex align-center justify-space-between flex-wrap ga-2 mt-3">
        <v-chip v-if="habit.isDaily" size="small" variant="tonal" color="primary">
          Every day
        </v-chip>

        <div v-else class="habit-days">
          <v-chip
            v-for="(d, idx) in days"
            :key="idx"
            size="x-small"
            variant="tonal"
            :color="habit.days && habit.days[idx] ? 'primary' : undefined"
            class="habit-day-chip"
          >
            {{ d }}
          </v-chip>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
const CATEGORY_MAP = {
  sport: { label: 'Sport', color: '#ef4444' },
  study: { label: 'Study', color: '#d4af37' },
  health: { label: 'Health', color: '#22c55e' },
  work: { label: 'Work', color: '#3b82f6' },
  other: { label: 'Other', color: '#a855f7' }
}

export default {
  name: 'HabitCard',
  props: {
    habit: { type: Object, required: true }
  },
  emits: ['toggle', 'edit', 'delete'],
  data() {
    return {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  },
  computed: {
    categoryInfo() {
      return CATEGORY_MAP[this.habit.category] || CATEGORY_MAP.other
    },
    categoryLabel() {
      return this.categoryInfo.label
    },
    categoryColor() {
      return this.categoryInfo.color
    }
  },
  methods: {
    toggle() {
      this.$emit('toggle', this.habit.id)
    },
    onEdit() {
      this.$emit('edit', this.habit)
    },
    onDelete() {
      this.$emit('delete', this.habit.id)
    },
    formatDate(value) {
      const d = new Date(value)
      if (Number.isNaN(d.getTime())) return ''
      return d.toLocaleDateString()
    }
  }
}
</script>
