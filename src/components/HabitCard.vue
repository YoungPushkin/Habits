<template>
  <v-card
    class="card"
    :variant="doneToday ? 'flat' : 'tonal'"
    :style="doneToday ? {
      borderColor: 'rgba(74,222,128,.45)',
      boxShadow: '0 0 0 1px rgba(74,222,128,.35), 0 18px 45px rgba(0,0,0,.75)'
    } : null"
  >
    <v-card-text class="card-stack">
      <div class="card-head">
        <div class="card-head-main">
          <v-btn
            v-if="showToggle"
            icon
            variant="text"
            class="habit-toggle"
            :ripple="false"
            :disabled="!dueToday"
            @click="toggle"
          >
            <i v-if="doneToday" class="bi bi-check-lg act-ok"></i>
            <i v-else class="bi bi-circle"></i>
          </v-btn>

          <div class="habit-meta">
            <span class="item-title">{{ habit.name }}</span>

            <v-chip v-if="habit.isDaily" size="x-small" variant="tonal" color="primary">
              Every day
            </v-chip>

            <div v-if="!habit.isDaily && selectedDays.length" class="habit-days">
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

            <div class="habit-category">
              <span class="habit-dot" :style="{ background: categoryColor }"></span>
              <span class="t-label">{{ categoryLabel }}</span>
            </div>
          </div>
        </div>

        <div class="card-head-actions">
          <v-chip
            size="small"
            :color="doneToday ? 'success' : 'warning'"
            variant="tonal"
          >
            {{ doneToday ? 'Done today' : 'Pending' }}
          </v-chip>

          <v-menu v-if="showMenu" location="bottom end">
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
        class="chip-start"
      >
        <i class="bi bi-calendar2-x" style="margin-right:6px;"></i>
        Not scheduled for today
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script>
import { HABIT_CATEGORY_MAP } from '../constants/habitCategories.js'

export default {
  name: 'HabitCard',
  props: {
    habit: { type: Object, required: true },
    doneToday: { type: Boolean, default: false },
    dueToday: { type: Boolean, default: true },
    showToggle: { type: Boolean, default: true },
    showMenu: { type: Boolean, default: true }
  },
  emits: ['toggle', 'edit', 'delete'],
  data() {
    return {
      weekLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  },
  computed: {
  categoryLabel() {
    return (HABIT_CATEGORY_MAP[this.habit.category] || HABIT_CATEGORY_MAP.other).label
  },
  categoryColor() {
    return (HABIT_CATEGORY_MAP[this.habit.category] || HABIT_CATEGORY_MAP.other).color
  },
  selectedDays() {
    const days = Array.isArray(this.habit.days) ? this.habit.days : []
    return this.weekLabels.filter((_, idx) => !!days[idx])
  }
  },
  methods: {
    toggle() {
      if (!this.dueToday) return
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

.habit-toggle :deep(.v-btn__overlay),
.habit-toggle :deep(.v-btn__underlay){opacity:0 !important}

.habit-toggle i{font-size:14px;color:var(--gold)}
.habit-toggle .bi-check-lg{font-size:18px}

.card-stack{
  display:flex;
  flex-direction:column;
  gap:12px;
}
.card-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  flex-wrap:wrap;
}
.card-head-main{
  display:flex;
  align-items:center;
  gap:12px;
  min-width:0;
}
.card-head-actions{
  display:flex;
  align-items:center;
  gap:8px;
}
.habit-meta{
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
  min-width:0;
}
.habit-days{
  display:flex;
  align-items:center;
  gap:4px;
  flex-wrap:wrap;
}
.habit-category{
  display:flex;
  align-items:center;
  gap:8px;
}
.habit-dot{
  width:10px;
  height:10px;
  border-radius:999px;
  display:inline-block;
}
.chip-start{
  align-self:flex-start;
}
</style>
