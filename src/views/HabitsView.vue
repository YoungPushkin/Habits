<script>
import HabitModalMixin from '../mixins/HabitModal.mixin'
import HabitCard from '../components/HabitCard.vue'
import HabitModal from '../components/HabitModal.vue'
import BaseCard from '../components/global/BaseCard.vue'
import PageHeader from '../components/global/PageHeader.vue'
import BaseButton from '../components/global/BaseButton.vue'
import { BUTTON_LABELS } from '../constants/buttons.js'

export default {
  name: 'HabitsView',
  mixins: [HabitModalMixin],
  components: { HabitCard, HabitModal, BaseCard, PageHeader, BaseButton },
  computed: {
    habitsUI() { return this.habitsStore.habitsUI },
    buttonLabels() { return BUTTON_LABELS }
  }
}
</script>

<template>
  <section class="app-page">
    <PageHeader title="Habits" subtitle="Create, edit and manage your habits.">
      <template #meta>
        <div class="page-actions">
          <BaseButton kind="primary" color="primary" @click="openHabitCreate">
            <i class="bi bi-plus-lg" style="margin-right:8px;"></i>
            {{ buttonLabels.addHabit }}
          </BaseButton>
        </div>
      </template>
    </PageHeader>

    <BaseCard title="All habits" body-class="card-scroll">
      <template #meta>
        <v-chip size="small" variant="tonal" color="primary">
          Total: {{ habitsUI.length }}
        </v-chip>
      </template>

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
    </BaseCard>

    <HabitModal
      v-if="showModal && modalType === 'habit'"
      :mode="modalMode"
      :habit="selectedItem"
      @close="closeModal"
      @save="submitHabit"
    />
  </section>
</template>


