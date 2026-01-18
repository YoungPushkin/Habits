<script>
import CarouselMixin from '../mixins/Carousel.mixin'
import HabitModalMixin from '../mixins/HabitModal.mixin'
import TaskModalMixin from '../mixins/TaskModal.mixin'

import HabitModal from '../components/HabitModal.vue'
import TaskModal from '../components/TaskModal.vue'
import HabitCard from '../components/HabitCard.vue'
import TaskCard from '../components/TaskCard.vue'
import HfCarousel from '../components/global/HfCarousel.vue'
import BaseCard from '../components/global/BaseCard.vue'
import PageHeader from '../components/global/PageHeader.vue'
import BaseButton from '../components/global/BaseButton.vue'
import BaseChip from '../components/global/BaseChip.vue'
import CarouselControls from '../components/global/CarouselControls.vue'
import { BUTTON_LABELS } from '../constants/buttons.js'

export default {
  name: 'DashboardView',
  mixins: [CarouselMixin, HabitModalMixin, TaskModalMixin],
  components: { HabitModal, TaskModal, HabitCard, TaskCard, HfCarousel, BaseCard, PageHeader, BaseButton, BaseChip, CarouselControls },

  computed: {
    todayHabitsForUI() { return this.habitsStore.todayHabitsForUI },
    importantTasks() { return this.tasksStore.importantTasks },
    todayLabel() {
      return new Date().toLocaleDateString('en-US', { weekday: 'long' })
    },
    buttonLabels() { return BUTTON_LABELS }
  }
}
</script>

<template>
  <section class="dashboard app-page">
    <PageHeader title="Today overview" subtitle="Habits, tasks and progress for your day.">
      <template #meta>
        <BaseChip size="small" variant="tonal">
          <i class="bi bi-calendar2" style="margin-right:8px;"></i>
          {{ todayLabel }}
        </BaseChip>
      </template>
    </PageHeader>

    <div class="stats">
      <BaseCard title="Habits">
        <template #meta>
          <div class="t-label">Day completion</div>
        </template>

        <div class="stat-row">
          <div class="t-value">{{ habitsStore.completionPercent }}%</div>
          <div class="t-cap">{{ habitsStore.todayDone }} of {{ habitsStore.todayTotal }} habits</div>
        </div>

        <v-progress-linear
          :model-value="habitsStore.completionPercent"
          height="8"
          rounded
          color="primary"
        />
      </BaseCard>

      <BaseCard title="Discipline">
        <template #meta>
          <div class="t-label">Current streak</div>
        </template>

        <div class="stat-row">
          <div class="t-value">{{ habitsStore.currentStreak }} days</div>
          <div class="t-cap">days in a row</div>
        </div>

        <div class="streak">
          <span
            v-for="n in 7"
            :key="n"
            class="streak-dot"
            :style="n <= Math.min(7, Math.round(habitsStore.currentStreak / 2)) ? {
              background: 'linear-gradient(90deg,var(--gold),var(--gold2))',
              borderColor: 'rgba(212,175,55,.45)',
              boxShadow: '0 10px 22px rgba(212,175,55,.16)'
            } : null"
          ></span>
        </div>
      </BaseCard>

      <BaseCard title="Month">
        <template #meta>
          <div class="t-label">Tasks done</div>
        </template>

        <div class="stat-row">
          <div class="t-value">{{ tasksStore.monthTasksDone }}</div>
          <div class="t-cap">{{ tasksStore.monthTasksTotal }} total tasks</div>
        </div>

        <div class="bars">
          <span
            v-for="n in 5"
            :key="n"
            class="bar"
            :class="{ 'is-on': n <= Math.min(4, Math.round(tasksStore.monthTasksPercent / 25)) }"
          />
        </div>
      </BaseCard>
    </div>

    <div class="middle-row">
      <BaseCard title="Habits for today" subtitle="Keep your promises to yourself.">
        <template #meta>
          <CarouselControls
            :index="habitsStore.currentHabitNumber(habitsIndex)"
            :total="todayHabitsForUI.length"
            :at-start="todayHabitsForUI.length <= 1 || habitsIndex <= 0"
            :at-end="todayHabitsForUI.length <= 1 || habitsIndex >= todayHabitsForUI.length - 1"
            :show-counter="!!todayHabitsForUI.length"
            @prev="habitsCarouselPrev"
            @next="habitsCarouselNext"
          />
        </template>

        <div v-if="todayHabitsForUI.length === 0" class="t-body">
          No habits for today
        </div>

        <template v-else>
          <HfCarousel ref="habitsCarousel" :items="todayHabitsForUI" @index="onHabitsIndex">
            <template #default="{ item }">
              <HabitCard
                :habit="item"
                :done-today="item.doneToday"
                :due-today="true"
                @toggle="toggleHabit"
                @delete="deleteHabit"
                @edit="openHabitEdit"
              />
            </template>
          </HfCarousel>
        </template>
      </BaseCard>

      <BaseCard title="Quick actions" subtitle="Create new tasks and habits.">
        <div class="quick-actions">
          <BaseButton kind="primary" color="primary" @click="openTaskCreate">
            <i class="bi bi-plus-lg" style="margin-right:8px;"></i>
            {{ buttonLabels.addTask }}
          </BaseButton>

          <BaseButton kind="primary" color="primary" @click="openHabitCreate">
            <i class="bi bi-plus-lg" style="margin-right:8px;"></i>
            {{ buttonLabels.addHabit }}
          </BaseButton>
        </div>
      </BaseCard>
    </div>

    <BaseCard title="Important timeline" subtitle="High priority and near deadlines.">
        <template #meta>
          <CarouselControls
            :index="tasksStore.currentTaskNumber(tasksIndex)"
            :total="importantTasks.length"
            :at-start="importantTasks.length <= 1 || tasksIndex <= 0"
            :at-end="importantTasks.length <= 1 || tasksIndex >= importantTasks.length - 1"
            :show-counter="!!importantTasks.length"
            @prev="tasksCarouselPrev"
            @next="tasksCarouselNext"
          />
        </template>

        <v-alert
          v-if="!importantTasks.length"
          type="info"
          variant="tonal"
          density="comfortable"
        >
          No important tasks right now.
        </v-alert>

        <template v-else>
          <HfCarousel ref="tasksCarousel" :items="importantTasks" @index="onTasksIndex">
            <template #default="{ item }">
              <TaskCard
                :task="item"
                @complete="completeTask"
                @edit="openTaskEdit"
                @delete="deleteTask"
              />
            </template>
          </HfCarousel>
        </template>
      </BaseCard>

    <HabitModal
      v-if="showModal && modalType === 'habit'"
      :mode="modalMode"
      :habit="modalType === 'habit' ? selectedItem : null"
      @close="closeModal"
      @save="submitHabit"
    />

    <TaskModal
      v-if="showModal && modalType === 'task'"
      :mode="modalMode"
      :task="modalType === 'task' ? selectedItem : null"
      @close="closeModal"
      @save="submitTask"
    />
  </section>
</template>
