<template>
  <v-card
    class="card"
    :variant="doneToday ? 'flat' : 'tonal'"
    :style="doneToday ? {
      borderColor: 'rgba(74,222,128,.45)',
      boxShadow: '0 0 0 1px rgba(74,222,128,.35), 0 18px 45px rgba(0,0,0,.75)'
    } : null"
  >
    <v-card-title class="d-flex align-center justify-space-between ga-3">
      <div class="d-flex align-center ga-2 min-w-0">
        <span
          :style="{
            width: '10px',
            height: '10px',
            borderRadius: '999px',
            background: categoryColor,
            display: 'inline-block'
          }"
        ></span>
        <span class="t-label">{{ categoryLabel }}</span>
      </div>

      <div class="d-flex align-center ga-2">
        <v-chip
          size="small"
          :color="doneToday ? 'success' : 'warning'"
          variant="tonal"
        >
          {{ doneToday ? 'Done today' : 'Pending' }}
        </v-chip>

        <v-menu location="bottom end">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon variant="tonal" size="small" class="btn-icon">
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
            :disabled="doneToday || !dueToday"
            @click="toggle"
          >
            <i v-if="doneToday" class="bi bi-check-lg act-ok"></i>
            <i v-else class="bi bi-circle"></i>
          </v-btn>
        </template>

        <template #title>
          <span class="item-title">{{ habit.name }}</span>
        </template>
      </v-list-item>

      <div class="d-flex align-center justify-space-between flex-wrap ga-2 mt-3">
        <v-chip v-if="habit.isDaily" size="small" variant="tonal" color="primary">
          Every day
        </v-chip>

        <div v-else>
          <v-chip
            v-for="(d, idx) in weekLabels"
            :key="idx"
            size="x-small"
            variant="tonal"
            :color="habit.days && habit.days[idx] ? 'primary' : undefined"
          >
            {{ d }}
          </v-chip>
        </div>
      </div>

      <div v-if="!dueToday" class="t-cap mt-3">
        Not scheduled for today
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
    habit: { type: Object, required: true },
    doneToday: { type: Boolean, default: false },
    dueToday: { type: Boolean, default: true }
  },
  emits: ['toggle', 'edit', 'delete'],
  data() {
    return {
      weekLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  },
  computed: {
  categoryLabel() {
    return (CATEGORY_MAP[this.habit.category] || CATEGORY_MAP.other).label
  },
  categoryColor() {
    return (CATEGORY_MAP[this.habit.category] || CATEGORY_MAP.other).color
  }
  },
  methods: {
    toggle() {
      if (this.doneToday || !this.dueToday) return
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
