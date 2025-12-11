<template>
  <div class="habit-card">
    <div class="habit-card-top">
      <div class="habit-card-bookmark" :style="{ backgroundColor: categoryColor }"></div>
      <span class="habit-card-category">{{ categoryLabel }}</span>
      <div class="habit-card-top-right">
        <span
          class="habit-card-status"
          :class="habit.doneToday ? 'status-done' : 'status-pending'"
        >
          {{ habit.doneToday ? 'Done today' : 'Pending' }}
        </span>
        <div class="habit-card-menu-wrapper">
          <button
            type="button"
            class="habit-card-menu-btn"
            @click.stop="menuOpen = !menuOpen"
          >
            <i class="bi bi-three-dots-vertical"></i>
          </button>
          <div v-if="menuOpen" class="habit-card-menu" @click.stop>
            <button type="button" class="habit-card-menu-item" @click="onEdit">
              Edit
            </button>
            <button type="button" class="habit-card-menu-item danger" @click="onDelete">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="habit-card-body">
      <div class="habit-card-main-row">
        <button
          type="button"
          class="habit-card-check"
          :class="{ active: habit.doneToday }"
          @click="$emit('toggle', habit.id)"
        >
          <i v-if="habit.doneToday" class="bi bi-check-lg"></i>
        </button>
        <div class="habit-card-text">
          <span class="habit-card-name">{{ habit.name }}</span>
          <span class="habit-card-created" v-if="habit.createdAt">
            Created: {{ habit.createdAt }}
          </span>
        </div>
      </div>

      <div class="habit-card-bottom">
        <div v-if="habit.isDaily" class="habit-card-pill">
          Every day
        </div>
        <div v-else class="habit-card-days-row">
          <span
            v-for="(d, idx) in days"
            :key="idx"
            class="habit-card-day-dot"
            :class="{ active: habit.days && habit.days[idx] }"
          >
            {{ d }}
          </span>
        </div>
      </div>
    </div>
  </div>
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
    habit: {
      type: Object,
      required: true
    }
  },
  emits: ['toggle', 'edit', 'delete'],
  data() {
    return {
      menuOpen: false,
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
    onEdit() {
      this.menuOpen = false
      this.$emit('edit', this.habit)
    },
    onDelete() {
      this.menuOpen = false
      this.$emit('delete', this.habit.id)
    }
  }
}
</script>
