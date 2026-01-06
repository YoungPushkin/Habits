<script>
import CarouselMixin from '../mixins/Carousel.mixin'
import HabitModalMixin from '../mixins/HabitModal.mixin'
import TaskModalMixin from '../mixins/TaskModal.mixin'

import HabitModal from '../components/HabitModal.vue'
import TaskModal from '../components/TaskModal.vue'
import HabitCard from '../components/HabitCard.vue'
import TaskCard from '../components/TaskCard.vue'
import HfCarousel from '../components/layout/HfCarousel.vue'

export default {
  name: 'DashboardView',
  mixins: [CarouselMixin, HabitModalMixin, TaskModalMixin],
  components: { HabitModal, TaskModal, HabitCard, TaskCard, HfCarousel },

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
    <div class="page-head">
      <div class="page-title">
        <h1 class="t-h1 text-gold">Today overview</h1>
        <p class="t-sub text-gold">Habits, tasks and progress for your day.</p>
      </div>

      <div class="page-meta">
        <v-chip size="small" variant="tonal" color="primary">
          <span class="t-label" style="margin-right:8px;">Focus mode</span>
          <span class="dot"></span>
          <span style="margin-left:8px;">On</span>
        </v-chip>

        <v-chip size="small" variant="tonal">
          <i class="bi bi-calendar2" style="margin-right:8px;"></i>
          {{ todayLabel }}
        </v-chip>
      </div>
    </div>

    <div class="stats">
      <v-card class="card" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="t-label">Habits</div>
            <div class="t-label">Day completion</div>
          </div>

          <div class="d-flex align-end ga-3 mb-3">
            <div class="t-value">{{ habitsStore.completionPercent }}%</div>
            <div class="t-cap">{{ habitsStore.todayDone }} of {{ habitsStore.todayTotal }} habits</div>
          </div>

          <v-progress-linear
            :model-value="habitsStore.completionPercent"
            height="8"
            rounded
            color="primary"
          />
        </v-card-text>
      </v-card>

      <v-card class="card" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="t-label">Discipline</div>
            <div class="t-label">Best streak</div>
          </div>

          <div class="d-flex align-end ga-3 mb-3">
            <div class="t-value">{{ habitsStore.bestStreak }} days</div>
            <div class="t-cap">Longest chain</div>
          </div>

          <div class="streak">
            <span
              v-for="n in 7"
              :key="n"
              class="streak-dot"
              :style="n <= habitsStore.disciplineDots ? {
                background: 'linear-gradient(90deg,var(--gold),var(--gold2))',
                borderColor: 'rgba(212,175,55,.45)',
                boxShadow: '0 10px 22px rgba(212,175,55,.16)'
              } : null"
            ></span>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="card" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="t-label">Month</div>
            <div class="t-label">Tasks done</div>
          </div>

          <div class="d-flex align-end ga-3 mb-3">
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
        </v-card-text>
      </v-card>
    </div>

    <div class="middle-row">
      <v-card class="card" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between">
          <div>
            <div class="t-h2">Habits for today</div>
            <p class="t-sub">Keep your promises to yourself.</p>
          </div>

          <div class="d-flex ga-2">
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
        </v-card-title>

        <v-divider />

        <v-card-text>
          <div v-if="todayHabitsForUI.length === 0" class="t-body">
            No habits for today
          </div>

          <div v-else>
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
          </div>
        </v-card-text>
      </v-card>

      <v-card class="card" variant="tonal">
        <v-card-title>
          <div>
            <div class="t-h2">Quick actions</div>
            <p class="t-sub">Create new tasks and habits.</p>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text class="d-flex flex-column ga-3">
          <v-btn variant="tonal" rounded="pill" color="primary" @click="openTaskCreate">
            <i class="bi bi-plus-lg" style="margin-right:8px;"></i>
            Add task
          </v-btn>

          <v-btn class="btn-primary" color="primary" variant="flat" rounded="pill" @click="openHabitCreate">
            <i class="bi bi-plus-lg" style="margin-right:8px;"></i>
            Add habit
          </v-btn>
        </v-card-text>
      </v-card>
    </div>

    <div class="bottom-row">
      <v-card class="card" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between flex-wrap ga-2">
          <div>
            <div class="t-h2">Important timeline</div>
            <p class="t-sub">High priority and near deadlines.</p>
          </div>

          <div class="d-flex ga-2">
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
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-alert
            v-if="!importantTasks.length"
            type="info"
            variant="tonal"
            density="comfortable"
          >
            No important tasks right now.
          </v-alert>

          <div v-else>
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
          </div>
        </v-card-text>
      </v-card>
    </div>

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
