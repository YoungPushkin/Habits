<script>
import { useHabitsStore } from '../stores/habits'
import { useTasksStore } from '../stores/tasks'
import { percent } from '../utils/math.js'
import HfCarousel from '../components/global/HfCarousel.vue'
import DonutChart from '../components/analytics/DonutChart.vue'
import BarChartCard from '../components/analytics/BarChartCard.vue'
import HabitCard from '../components/HabitCard.vue'
import BaseCard from '../components/global/BaseCard.vue'
import PageHeader from '../components/global/PageHeader.vue'

export default {
  name: 'AnalyticsView',
  components: { HfCarousel, DonutChart, BarChartCard, HabitCard, BaseCard, PageHeader},
  data() {
    return {
      habitsStore: useHabitsStore(),
      tasksStore: useTasksStore()
    }
  },
  computed: {
    completedTasksCount() { return this.tasksStore.completedTasksCount },
    activeTasksCount() { return this.tasksStore.activeTasksCount },
    totalActive() { return this.tasksStore.totalTasks },
    tasksCompletionPercent() { return this.tasksStore.tasksCompletionPercent },
    highCount() { return this.tasksStore.highCount },
    mediumCount() { return this.tasksStore.mediumCount },
    lowCount() { return this.tasksStore.lowCount },
    mostProductiveDay() { return this.tasksStore.mostProductiveDay },
    weeklyCompleted() { return this.tasksStore.weeklyCompleted },
    monthlyHistory() { return this.tasksStore.monthlyHistory },

    highPercent() {
      return percent(this.highCount, this.totalActive || 0)
    },
    mediumPercent() {
      return percent(this.mediumCount, this.totalActive || 0)
    },
    lowPercent() {
      return percent(this.lowCount, this.totalActive || 0)
    },

    currentStreak() { return this.habitsStore.currentStreak },
    averageWeekly() { return this.habitsStore.averageWeekly },
    weakestHabit() { return this.habitsStore.weakestHabit },
    weakestHabitCard() {
      const data = this.weakestHabit
      if (!data?.habit) return null
      const habit = data.habit
      const idx = this.habitsStore.todayWeekIdx
      const dueToday = habit.isDaily ? true : (Array.isArray(habit.days) ? !!habit.days[idx] : false)
      const doneToday = !!this.habitsStore.todayDoneMap?.[habit.id]
      return { habit, dueToday, doneToday, stats: data }
    },

    prioritySegments() {
      return [
        { key: 'high', percent: this.highPercent, className: 'p-high' },
        { key: 'med', percent: this.mediumPercent, className: 'p-med' },
        { key: 'low', percent: this.lowPercent, className: 'p-low' }
      ]
    },

    progressSegments() {
      return [
        { key: 'done', percent: this.tasksCompletionPercent, className: 'p-done' }
      ]
    },

    analyticsSlides() {
      return [
        { key: 'priority-week' },
        { key: 'history-progress' }
      ]
    }
  },

}
</script>

<template>
  <section class="app-page">
    <PageHeader title="Analytics" subtitle="Deep insights into your discipline and progress.">
      <template #meta>
        <v-chip class="ma-0" variant="tonal">
          <span class="t-cap">Total days tracked</span>
          <span class="t-body ms-2">{{ habitsStore.activeDays || 0 }}</span>
        </v-chip>

        <v-chip class="ma-0" variant="tonal">
          <span class="t-cap">Tasks completed</span>
          <span class="t-body ms-2">{{ completedTasksCount }}</span>
        </v-chip>
      </template>
    </PageHeader>

    <div class="stats">
      <BaseCard title="Habits">
        <template #meta>
          <div class="t-label">Best streak</div>
        </template>

        <div class="stat-row">
          <div class="t-value">{{ habitsStore.bestStreak || 0 }}</div>
          <div class="t-cap">consecutive days</div>
        </div>

        <div class="streak">
          <span
            v-for="n in 14"
            :key="n"
            class="streak-dot"
            :class="{ 'is-on': n <= Math.min(14, habitsStore.bestStreak || 0) }"
          />
        </div>
      </BaseCard>

      <BaseCard title="Weakest habit">
        <template #meta>
          <div class="t-label">Lowest completion</div>
        </template>

        <div v-if="weakestHabitCard" class="d-flex flex-column ga-3">
          <HabitCard
            :habit="weakestHabitCard.habit"
            :done-today="weakestHabitCard.doneToday"
            :due-today="weakestHabitCard.dueToday"
            :show-toggle="false"
            :show-menu="false"
          />
          <div class="t-cap">
            {{ weakestHabitCard.stats.percent }}% · {{ weakestHabitCard.stats.done }} / {{ weakestHabitCard.stats.due }} days
          </div>
        </div>
        <div v-else class="t-cap">No habits yet</div>
      </BaseCard>

      <BaseCard title="Habits">
        <template #meta>
          <div class="t-label">Weekly avg</div>
        </template>

        <div class="stat-row">
          <div class="t-value">{{ averageWeekly }}%</div>
          <div class="t-cap">completion</div>
        </div>

        <v-progress-linear :model-value="averageWeekly" height="8" rounded color="primary" />
      </BaseCard>
    </div>

    <HfCarousel class="analytics-carousel" :items="analyticsSlides">
      <template #nav="{ prev, next, atStart, atEnd, index, total }">
        <div class="carousel-controls-center">
          <v-btn
            icon
            size="small"
            class="btn-icon act-gold"
            variant="tonal"
            :disabled="atStart"
            @click="prev"
          >
            <i class="bi bi-chevron-left"></i>
          </v-btn>
          <v-chip size="small" variant="tonal" color="primary">
            {{ index + 1 }} / {{ total }}
          </v-chip>
          <v-btn
            icon
            size="small"
            class="btn-icon act-gold"
            variant="tonal"
            :disabled="atEnd"
            @click="next"
          >
            <i class="bi bi-chevron-right"></i>
          </v-btn>
        </div>
      </template>

      <template #default="{ item }">
        <div class="analytics-grid">
          <template v-if="item.key === 'priority-week'">
            <BaseCard title="Tasks by priority" subtitle="Active tasks distribution">
              <template #meta>
                <v-chip size="small" variant="tonal" color="primary">
                  {{ totalActive }} active
                </v-chip>
              </template>

              <div v-if="totalActive > 0" class="split">
                <DonutChart :segments="prioritySegments" />

                <div class="legend">
                  <div class="legend-item t-cap p-high">
                    <span class="legend-dot"></span>
                    High ({{ highCount }})
                  </div>
                  <div class="legend-item t-cap p-med">
                    <span class="legend-dot"></span>
                    Medium ({{ mediumCount }})
                  </div>
                  <div class="legend-item t-cap p-low">
                    <span class="legend-dot"></span>
                    Low ({{ lowCount }})
                  </div>
                </div>
              </div>

              <div v-else class="t-cap">No active tasks yet</div>
            </BaseCard>

            <BarChartCard
              title="Tasks this week"
              :subtitle="`Most productive: ${mostProductiveDay}`"
              :items="weeklyCompleted"
            />
          </template>

          <template v-else>
            <BarChartCard
              title="Monthly history"
              subtitle="Completed tasks (last 6 months)"
              :items="monthlyHistory"
            />

            <BaseCard title="Tasks progress" subtitle="Overall completion">
              <template #meta>
                <v-chip size="small" variant="tonal" color="primary">
                  {{ completedTasksCount }} done
                </v-chip>
              </template>

              <DonutChart :segments="progressSegments">
                <template #label>
                  <span class="t-h2">{{ tasksCompletionPercent }}%</span>
                  <span class="t-cap">completed</span>
                </template>
              </DonutChart>
            </BaseCard>
          </template>
        </div>
      </template>
    </HfCarousel>
  </section>
</template>
