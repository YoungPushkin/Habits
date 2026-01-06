<script>
import HabitModalMixin from '../mixins/HabitModal.mixin'
import HabitCard from '../components/HabitCard.vue'
import HabitModal from '../components/HabitModal.vue'

export default {
  name: 'HabitsView',
  mixins: [HabitModalMixin],
  components: { HabitCard, HabitModal },
  computed: {
    habitsUI() { return this.habitsStore.habitsUI }
  }
}
</script>

<template>
  <section class="habits app-page">
    <div class="page-head">
      <div class="page-title">
        <h1 class="t-h1 text-gold">Habits</h1>
        <p class="t-sub text-gold">Create, edit and manage your habits.</p>
      </div>

      <div class="page-actions">
        <v-btn class="btn-primary" color="primary" variant="flat" rounded="pill" @click="openHabitCreate">
          <i class="bi bi-plus-lg" style="margin-right:8px;"></i>
          Add habit
        </v-btn>
      </div>
    </div>

    <v-card class="card" variant="tonal">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="t-h2">All habits</div>
        <v-chip size="small" variant="tonal" color="primary">
          Total: {{ habitsUI.length }}
        </v-chip>
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
            @edit="openHabitEdit"
            @delete="deleteHabit"
          />
        </div>
      </v-card-text>
    </v-card>

    <HabitModal
      v-if="showModal && modalType === 'habit'"
      :mode="modalMode"
      :habit="selectedItem"
      @close="closeModal"
      @save="submitHabit"
    />
  </section>
</template>
