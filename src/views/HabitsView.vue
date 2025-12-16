<template>
  <section class="app-page">
    <div class="page-head">
      <div class="page-title">
        <h1 class="t-h1 text-gold">Habits</h1>
        <p class="t-sub text-gold">Create, edit and manage your habits.</p>
      </div>

      <v-chip size="small" variant="tonal" color="primary">
        Total: {{ habits.length }}
      </v-chip>
    </div>

    <div class="page-actions">
      <v-btn class="btn-primary" variant="flat" rounded="pill" @click="openCreateHabit">
        Add habit
      </v-btn>
    </div>

    <v-card class="card" variant="tonal">
      <v-card-title>
        <div class="t-h2 text-silver">All habits</div>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <div v-if="habits.length === 0" class="t-body">
          No habits yet. Click "Add habit" to create one.
        </div>

        <div v-else class="stack">
          <HabitCard
            v-for="h in habits"
            :key="h.id"
            :habit="h"
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
    habits() {
      return this.store ? this.store.habits : []
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

      if (this.habitModalMode === 'create') {
        this.store.addHabit(payload.name, '', 'custom', payload.category, payload.isDaily, payload.days)
      } else if (this.selectedHabit) {
        this.store.editHabit(this.selectedHabit.id, {
          name: payload.name,
          category: payload.category,
          isDaily: payload.isDaily,
          days: payload.days
        })
      }

      this.onHabitModalClose()
    },
    toggleHabit(id) {
      this.store?.toggleHabit?.(id)
    },
    deleteHabit(id) {
      this.store?.deleteHabit?.(id)
      if (this.selectedHabit && this.selectedHabit.id === id) this.onHabitModalClose()
    }
  }
}
</script>
