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
import BaseButton from '../components/global/BaseButton.vue'
import BaseChip from '../components/global/BaseChip.vue'
import CarouselControls from '../components/global/CarouselControls.vue'

export default {
  name: 'AnalyticsView',
  components: { HfCarousel, DonutChart, BarChartCard, HabitCard, BaseCard, PageHeader, BaseButton, BaseChip, CarouselControls },
  data() {
    return {
      habitsStore: useHabitsStore(),
      tasksStore: useTasksStore(),
      weekIndex: 0
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
    weeklyHistory() { return this.tasksStore.weeklyHistory },
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
    priorityLegendItems() {
      return [
        { key: 'high', label: 'High', count: this.highCount, className: 'p-high' },
        { key: 'med', label: 'Medium', count: this.mediumCount, className: 'p-med' },
        { key: 'low', label: 'Low', count: this.lowCount, className: 'p-low' }
      ]
    },

    progressSegments() {
      return [
        { key: 'done', percent: this.tasksCompletionPercent, className: 'p-done' }
      ]
    },

    currentWeek() { return this.weeklyHistory?.[this.weekIndex] || null },
    weekAtStart() { return this.weekIndex <= 0 },
    weekAtEnd() { return this.weekIndex >= ((this.weeklyHistory?.length || 1) - 1) },
    weekTotal() { return this.weeklyHistory?.length || 0 },

    analyticsSlides() {
      return [
        { key: 'priority-week' },
        { key: 'history-progress' }
      ]
    }
  },

  methods: {
    prevWeek() { if (!this.weekAtStart) this.weekIndex -= 1 },
    nextWeek() { if (!this.weekAtEnd) this.weekIndex += 1 }
  },

  watch: {
    weeklyHistory: {
      immediate: true,
      deep: true,
      handler(val) {
        const max = (val?.length || 1) - 1
        this.weekIndex = Math.max(0, max)
      }
    }
  }

}
</script>

<template>
  <section class="app-page">
    <PageHeader title="Analytics" subtitle="Deep insights into your discipline and progress.">
      <template #meta>
        <BaseChip class="ma-0" variant="tonal">
          <span class="t-cap">Total days tracked</span>
          <span class="t-body ms-2">{{ habitsStore.activeDays || 0 }}</span>
        </BaseChip>

        <BaseChip class="ma-0" variant="tonal">
          <span class="t-cap">Tasks completed</span>
          <span class="t-body ms-2">{{ completedTasksCount }}</span>
        </BaseChip>
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
        <CarouselControls
          align="center"
          :index="index + 1"
          :total="total"
          :at-start="atStart"
          :at-end="atEnd"
          @prev="prev"
          @next="next"
        />
      </template>

      <template #default="{ item }">
        <div class="analytics-grid">
          <template v-if="item.key === 'priority-week'">
            <DonutChart
              title="Tasks by priority"
              subtitle="Active tasks distribution"
              :segments="prioritySegments"
              :legend-items="priorityLegendItems"
              :empty="totalActive === 0"
              empty-text="No active tasks yet"
              content-class="split"
            >
              <template #meta>
                <BaseChip size="small" variant="tonal" color="primary">
                  {{ totalActive }} active
                </BaseChip>
              </template>
            </DonutChart>

            <BarChartCard
              title="Tasks by week"
              :subtitle="currentWeek ? currentWeek.label : ''"
              :items="currentWeek ? currentWeek.items : []"
            >
              <template #title-actions>
                <CarouselControls
                  align="center"
                  :index="weekIndex + 1"
                  :total="weekTotal"
                  :at-start="weekAtStart"
                  :at-end="weekAtEnd"
                  @prev="prevWeek"
                  @next="nextWeek"
                />
              </template>
            </BarChartCard>
          </template>

          <template v-else>
            <BarChartCard
              title="Monthly history"
              subtitle="Completed tasks (last 6 months)"
              :items="monthlyHistory"
            />

            <DonutChart title="Tasks progress" subtitle="Overall completion" :segments="progressSegments">
              <template #meta>
                <BaseChip size="small" variant="tonal" color="primary">
                  {{ completedTasksCount }} done
                </BaseChip>
              </template>

              <template #label>
                <span class="t-h2">{{ tasksCompletionPercent }}%</span>
                <span class="t-cap">completed</span>
              </template>
            </DonutChart>
          </template>
        </div>
      </template>
    </HfCarousel>
  </section>
</template>
