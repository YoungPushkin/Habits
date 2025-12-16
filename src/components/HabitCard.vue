<template>
  <v-card class="card" variant="tonal">
    <v-card-title class="d-flex align-center justify-space-between ga-3">
      <div class="d-flex align-center ga-2 min-w-0">
        <span :style="{ width:'10px', height:'10px', borderRadius:'999px', backgroundColor: categoryColor, display:'inline-block' }"></span>
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
    </v-card-title>

    <v-divider />

    <v-card-text class="pt-4">
      <v-list-item class="px-0" lines="two">
        <template #prepend>
          <v-btn
            icon
            variant="text"
            class="habit-toggle"
            :ripple="false"
            @click="toggle"
          >
            <i v-if="habit.doneToday" class="bi bi-check-lg"></i>
            <i v-else class="bi bi-circle"></i>
          </v-btn>
        </template>

        <template #title>
          <span class="t-body">{{ habit.name }}</span>
        </template>

        <template #subtitle>
          <span class="t-cap"></span>
        </template>
      </v-list-item>

      <div class="d-flex align-center justify-space-between flex-wrap ga-2 mt-3">
        <v-chip v-if="habit.isDaily" size="small" variant="tonal" color="primary">
          Every day
        </v-chip>

        <div v-else class="d-flex ga-2 flex-wrap">
          <v-chip
            v-for="(d, idx) in days"
            :key="idx"
            size="x-small"
            variant="tonal"
            :color="habit.days && habit.days[idx] ? 'primary' : undefined"
            class="day-chip"
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
    return { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }
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
    }
  }
}
</script>
