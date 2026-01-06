<template>
  <v-card
    class="card"
    :variant="doneToday ? 'flat' : 'tonal'"
    :style="doneToday ? {
      borderColor: 'rgba(74,222,128,.45)',
      boxShadow: '0 0 0 1px rgba(74,222,128,.35), 0 18px 45px rgba(0,0,0,.75)'
    } : null"
  >
    <v-card-text class="d-flex flex-column ga-3">
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <div class="d-flex align-center ga-3 min-w-0">
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

          <div class="d-flex align-center ga-2 flex-wrap min-w-0">
            <span class="item-title">{{ habit.name }}</span>

            <v-chip v-if="habit.isDaily" size="x-small" variant="tonal" color="primary">
              Every day
            </v-chip>

            <div
              v-if="!habit.isDaily && selectedDays.length"
              class="d-flex align-center flex-wrap ga-1"
            >
              <v-chip
                v-for="d in selectedDays"
                :key="d"
                size="x-small"
                variant="tonal"
                color="primary"
              >
                {{ d }}
              </v-chip>
            </div>

            <div class="d-flex align-center ga-2">
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
          </div>
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
      </div>

      <v-chip
        v-if="!dueToday"
        size="small"
        variant="tonal"
        color="warning"
        class="align-self-start"
      >
        <i class="bi bi-calendar2-x" style="margin-right:6px;"></i>
        Not scheduled for today
      </v-chip>
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
  },
  selectedDays() {
    const days = Array.isArray(this.habit.days) ? this.habit.days : []
    return this.weekLabels.filter((_, idx) => !!days[idx])
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
