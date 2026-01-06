<script>
import { useHabitsStore } from '../stores/habits'
import { useTasksStore } from '../stores/tasks'
import { percent } from '../utils/math.js'
import { percentOfMax } from '../utils/chart.js'

export default {
  name: 'AnalyticsView',
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
    averageWeekly() { return this.habitsStore.averageWeekly }
  },

  methods: {
    barHeight(count) {
      return percentOfMax(count, this.weeklyCompleted.map(i => i.count))
    },
    monthHeight(count) {
      return percentOfMax(count, this.monthlyHistory.map(i => i.count))
    }
  }
}
</script>

<template>
  <section class="app-page">
    <div class="page-head">
      <div class="page-title">
        <h1 class="t-h1 text-gold">Analytics</h1>
        <p class="t-sub text-gold">Deep insights into your discipline and progress.</p>
      </div>

      <div class="page-meta">
        <v-chip class="ma-0" variant="tonal">
          <span class="t-cap">Total days tracked</span>
          <span class="t-body ms-2">{{ habitsStore.activeDays || 0 }}</span>
        </v-chip>

        <v-chip class="ma-0" variant="tonal">
          <span class="t-cap">Tasks completed</span>
          <span class="t-body ms-2">{{ completedTasksCount }}</span>
        </v-chip>
      </div>
    </div>

    <div class="stats">
      <v-card class="card" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="t-label">Habits</div>
            <div class="t-label">Best streak</div>
          </div>

          <div class="d-flex align-end ga-3 mb-3">
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
        </v-card-text>
      </v-card>

      <v-card class="card" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="t-label">Now</div>
            <div class="t-label">Current streak</div>
          </div>

          <div class="d-flex align-end ga-3 mb-3">
            <div class="t-value">{{ currentStreak }}</div>
            <div class="t-cap">days in a row</div>
          </div>

          <div class="t-cap">Keep going today to maintain it.</div>
        </v-card-text>
      </v-card>

      <v-card class="card" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="t-label">Remaining</div>
            <div class="t-label">Active tasks</div>
          </div>

          <div class="d-flex align-end ga-3 mb-3">
            <div class="t-value">{{ activeTasksCount }}</div>
            <div class="t-cap">to complete</div>
          </div>

          <div class="t-cap">Focus on high-priority first.</div>
        </v-card-text>
      </v-card>

      <v-card class="card" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="t-label">Habits</div>
            <div class="t-label">Weekly avg</div>
          </div>

          <div class="d-flex align-end ga-3 mb-3">
            <div class="t-value">{{ averageWeekly }}%</div>
            <div class="t-cap">completion</div>
          </div>

          <v-progress-linear :model-value="averageWeekly" height="8" rounded color="primary" />
        </v-card-text>
      </v-card>
    </div>

    <div class="analytics-grid">
      <v-card class="card" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between">
          <div>
            <div class="t-h2 text-silver">Tasks by priority</div>
            <p class="t-sub text-silver">Active tasks distribution</p>
          </div>

          <v-chip size="small" variant="tonal" color="primary">
            {{ totalActive }} active
          </v-chip>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <div v-if="totalActive > 0" class="split">
            <div class="donut">
              <svg viewBox="0 0 36 36" class="ring">
                <path
                  class="ring-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
                />
                <path
                  class="ring-seg p-high"
                  :stroke-dasharray="highPercent + ', 100'"
                  d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
                />
                <path
                  class="ring-seg p-med"
                  :stroke-dasharray="mediumPercent + ', 100'"
                  :stroke-dashoffset="-highPercent"
                  d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
                />
                <path
                  class="ring-seg p-low"
                  :stroke-dasharray="lowPercent + ', 100'"
                  :stroke-dashoffset="-(highPercent + mediumPercent)"
                  d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
                />
              </svg>
            </div>

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
        </v-card-text>
      </v-card>

      <v-card class="card" variant="tonal">
        <v-card-title>
          <div>
            <div class="t-h2 text-silver">Tasks this week</div>
            <p class="t-sub text-silver">Most productive: {{ mostProductiveDay }}</p>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <div class="chart-bars">
            <div v-for="item in weeklyCompleted" :key="item.label" class="chart-col">
              <div class="chart-box">
                <div class="chart-fill" :style="{ height: barHeight(item.count) + '%' }"></div>
              </div>
              <span class="t-cap">{{ item.label }}</span>
              <span class="t-cap">{{ item.count }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="card" variant="tonal">
        <v-card-title>
          <div>
            <div class="t-h2 text-silver">Monthly history</div>
            <p class="t-sub text-silver">Completed tasks (last 6 months)</p>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <div class="chart-bars">
            <div v-for="item in monthlyHistory" :key="item.label" class="chart-col">
              <div class="chart-box">
                <div class="chart-fill" :style="{ height: monthHeight(item.count) + '%' }"></div>
              </div>
              <span class="t-cap">{{ item.label }}</span>
              <span class="t-cap">{{ item.count }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="card" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between">
          <div>
            <div class="t-h2 text-silver">Tasks progress</div>
            <p class="t-sub text-silver">Overall completion</p>
          </div>

          <v-chip size="small" variant="tonal" color="primary">
            {{ completedTasksCount }} done
          </v-chip>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <div class="donut donut-center">
            <svg viewBox="0 0 36 36" class="ring">
              <path
                class="ring-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
              />
              <path
                class="ring-seg p-done"
                :stroke-dasharray="tasksCompletionPercent + ', 100'"
                d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
              />
            </svg>

            <div class="donut-label">
              <span class="t-h2">{{ tasksCompletionPercent }}%</span>
              <span class="t-cap">completed</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </section>
</template>



