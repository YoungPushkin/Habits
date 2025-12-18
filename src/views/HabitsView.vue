<script>
import habitsMixin from '../Mixins/HabitsView.mixin'
import HabitCard from '../components/HabitCard.vue'
import HabitModal from '../components/HabitModal.vue'

export default {
  name: 'HabitsView',
  mixins: [habitsMixin],
  components: { HabitCard, HabitModal }
}
</script>

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


