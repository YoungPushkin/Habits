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

export default {
  name: 'DashboardView',
  mixins: [CarouselMixin, HabitModalMixin, TaskModalMixin],
  components: { HabitModal, TaskModal, HabitCard, TaskCard, HfCarousel, BaseCard, PageHeader },

  computed: {
    todayHabitsForUI() { return this.habitsStore.todayHabitsForUI },
    importantTasks() { return this.tasksStore.importantTasks },
    todayLabel() {
      return new Date().toLocaleDateString('en-US', { weekday: 'long' })
    }
  }
}
</script>

<template>
  <section class="dashboard app-page">
    <PageHeader title="Today overview" subtitle="Habits, tasks and progress for your day.">
      <template #meta>
        <v-chip size="small" variant="tonal">
          <i class="bi bi-calendar2" style="margin-right:8px;"></i>
          {{ todayLabel }}
        </v-chip>
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
          <div class="carousel-controls">
            <v-btn
              icon
              size="small"
              variant="tonal"
              class="btn-icon act-gold"
              :disabled="todayHabitsForUI.length <= 1 || habitsIndex <= 0"
              @click="habitsCarouselPrev"
            >
              <i class="bi bi-chevron-left"></i>
            </v-btn>

            <v-chip v-if="todayHabitsForUI.length" size="small" variant="tonal" color="primary">
              {{ habitsStore.currentHabitNumber(habitsIndex) }} / {{ todayHabitsForUI.length }}
            </v-chip>

            <v-btn
              icon
              size="small"
              variant="tonal"
              class="btn-icon act-gold"
              :disabled="todayHabitsForUI.length <= 1 || habitsIndex >= todayHabitsForUI.length - 1"
              @click="habitsCarouselNext"
            >
              <i class="bi bi-chevron-right"></i>
            </v-btn>
          </div>
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
          <v-btn variant="tonal" rounded="pill" color="primary" @click="openTaskCreate">
            <i class="bi bi-plus-lg" style="margin-right:8px;"></i>
            Add task
          </v-btn>

          <v-btn class="btn-primary" color="primary" variant="flat" rounded="pill" @click="openHabitCreate">
            <i class="bi bi-plus-lg" style="margin-right:8px;"></i>
            Add habit
          </v-btn>
        </div>
      </BaseCard>
    </div>

    <BaseCard title="Important timeline" subtitle="High priority and near deadlines.">
        <template #meta>
          <div class="carousel-controls">
            <v-btn
              icon
              size="small"
              variant="tonal"
              class="btn-icon act-gold"
              :disabled="importantTasks.length <= 1 || tasksIndex <= 0"
              @click="tasksCarouselPrev"
            >
              <i class="bi bi-chevron-left"></i>
            </v-btn>

            <v-chip v-if="importantTasks.length" size="small" variant="tonal" color="primary">
              {{ tasksStore.currentTaskNumber(tasksIndex) }} / {{ importantTasks.length }}
            </v-chip>

            <v-btn
              icon
              size="small"
              variant="tonal"
              class="btn-icon act-gold"
              :disabled="importantTasks.length <= 1 || tasksIndex >= importantTasks.length - 1"
              @click="tasksCarouselNext"
            >
              <i class="bi bi-chevron-right"></i>
            </v-btn>
          </div>
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
