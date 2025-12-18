<template>
  <section class="habits app-page">
    <div class="page-head">
      <div class="page-title">
        <h1 class="t-h1 text-gold">Habits</h1>
        <p class="t-sub text-gold">Create, edit and manage your habits.</p>
      </div>

      <v-chip size="small" variant="tonal" color="primary">
        Total: {{ habitsUI.length }}
      </v-chip>
    </div>

    <div class="page-actions">
      <v-btn class="btn-primary" color="primary" variant="flat" rounded="pill" @click="openCreateHabit">
        Add habit
      </v-btn>
    </div>

    <v-card class="card" variant="tonal">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="t-h2">All habits</div>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <div v-if="habitsUI.length === 0" class="t-body">
          No habits yet. Click "Add habit" to create one.
        </div>

        <div v-else class="stack">
          <HabitCard
            v-for="h in habitsUI"
            :key="h.id"
            :habit="h"
            :done-today="h.doneToday"
            :due-today="h.dueToday"
            @toggle="toggleHabit"
            @edit="openEditHabit"
            @delete="deleteHabit"
          />
        </div>
      </v-card-text>
    </v-card>

    <HabitModal
      v-if="showHabitModal"
      :mode="habitModalMode"
      :habit="selectedHabit"
      @close="onHabitModalClose"
      @save="handleHabitSave"
    />
  </section>
</template>

<script>
import HabitCard from '../components/HabitCard.vue'
import HabitModal from '../components/HabitModal.vue'
import { useHabitsStore } from '../stores/habits'

export default {
  name: 'HabitsView',
  components: { HabitCard, HabitModal },
  data() {
    return {
      store: null,
      showHabitModal: false,
      habitModalMode: 'create',
      selectedHabit: null
    }
  },
  created() {
    this.store = useHabitsStore()
    this.store.initFromStorage?.()
  },
  computed: {
    habitsUI() {
      if (!this.store) return []
      const map = this.store.todayDoneMap || {}
      return (this.store.habits || []).map(h => ({
        ...h,
        dueToday: this.store.isHabitDueToday(h),
        doneToday: !!map[h.id]
      }))
    }
  },
  methods: {
    openCreateHabit() {
      this.habitModalMode = 'create'
      this.selectedHabit = null
      this.showHabitModal = true
    },
    openEditHabit(habit) {
      this.habitModalMode = 'edit'
      this.selectedHabit = { ...habit }
      this.showHabitModal = true
    },
    onHabitModalClose() {
      this.showHabitModal = false
      this.selectedHabit = null
      this.store?.initFromStorage?.()
    },
    handleHabitSave(payload) {
      if (!this.store) return
      if (this.habitModalMode === 'create') this.store.addHabit(payload)
      else if (this.selectedHabit) this.store.editHabit(this.selectedHabit.id, payload)
      this.onHabitModalClose()
    },
    toggleHabit(id) {
      this.store?.toggleHabitDoneToday?.(id)
      this.store?.initFromStorage?.()
    },
    deleteHabit(id) {
      this.store?.deleteHabit?.(id)
      if (this.selectedHabit && this.selectedHabit.id === id) this.onHabitModalClose()
      else this.store?.initFromStorage?.()
    }
  }
}
</script>
