<template>
  <section class="analytics">
    <div class="page-header">
      <div class="page-title">
        <h1 class="t-h1">Analytics</h1>
        <p class="t-subtitle">Deep insights into your discipline and progress.</p>
      </div>

      <div class="page-meta">
        <v-chip class="ma-0" variant="tonal">
          <span class="t-caption">Total days tracked</span>
          <span class="t-body ms-2">{{ habitsStore.activeDays || 0 }}</span>
        </v-chip>

        <v-chip class="ma-0" variant="tonal">
          <span class="t-caption">Tasks completed</span>
          <span class="t-body ms-2">{{ completedTasksCount }}</span>
        </v-chip>
      </div>
    </div>

    <v-row class="ma-0" dense>
      <v-col cols="12" md="6" lg="3">
        <v-card class="card" rounded="xl" variant="flat">
          <div class="stat-header">
            <span class="t-caption">Best streak</span>
            <span class="t-label">Habits</span>
          </div>

          <div class="t-h2">{{ habitsStore.bestStreak || 0 }}</div>
          <div class="t-caption">consecutive days</div>

          <div class="dots-row">
            <span
              v-for="n in 14"
              :key="n"
              class="dot-item"
              :class="{ 'dot-active': n <= (habitsStore.bestStreak || 0) }"
            ></span>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <v-card class="card" rounded="xl" variant="flat">
          <div class="stat-header">
            <span class="t-caption">Current streak</span>
            <span class="t-label">Now</span>
          </div>

          <div class="t-h2">{{ currentStreak }}</div>
          <div class="t-caption">days in a row</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <v-card class="card" rounded="xl" variant="flat">
          <div class="stat-header">
            <span class="t-caption">Active tasks</span>
            <span class="t-label">Remaining</span>
          </div>

          <div class="t-h2">{{ activeTasksCount }}</div>
          <div class="t-caption">to complete</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <v-card class="card" rounded="xl" variant="flat">
          <div class="stat-header">
            <span class="t-caption">Weekly average</span>
            <span class="t-label">Habits</span>
          </div>

          <div class="t-h2">{{ averageWeekly }}%</div>
          <div class="t-caption">completion</div>

          <v-progress-linear
            :model-value="averageWeekly"
            height="6"
            rounded
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row class="ma-0 mt-4" dense>
      <v-col cols="12" md="6">
        <v-card class="card" rounded="xl" variant="flat">
          <div class="stat-header">
            <div>
              <h2 class="t-h2">Tasks by priority</h2>
              <p class="t-caption">Active tasks distribution</p>
            </div>
          </div>

          <div v-if="totalActive > 0" class="chart-row">
            <svg viewBox="0 0 36 36" class="chart-ring">
              <path
                class="ring-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
              />
              <path
                class="ring-segment ring-high"
                :stroke-dasharray="highPercent + ', 100'"
                d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
              />
              <path
                class="ring-segment ring-medium"
                :stroke-dasharray="mediumPercent + ', 100'"
                :stroke-dashoffset="-highPercent"
                d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
              />
              <path
                class="ring-segment ring-low"
                :stroke-dasharray="lowPercent + ', 100'"
                :stroke-dashoffset="-(highPercent + mediumPercent)"
                d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
              />
            </svg>

            <div class="chart-legend">
              <div class="legend-item t-caption">
                <span class="legend-dot legend-high"></span>
                High ({{ highCount }})
              </div>
              <div class="legend-item t-caption">
                <span class="legend-dot legend-medium"></span>
                Medium ({{ mediumCount }})
              </div>
              <div class="legend-item t-caption">
                <span class="legend-dot legend-low"></span>
                Low ({{ lowCount }})
              </div>
            </div>
          </div>

          <div v-else class="t-caption">No active tasks yet</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="card" rounded="xl" variant="flat">
          <div class="stat-header">
            <div>
              <h2 class="t-h2">Tasks this week</h2>
              <p class="t-caption">Most productive: {{ mostProductiveDay }}</p>
            </div>
          </div>

          <div class="chart-bars">
            <div v-for="item in weeklyCompleted" :key="item.day" class="bar-col">
              <div class="bar-fill" :style="{ height: barHeight(item.count) + '%' }"></div>
              <span class="t-caption">{{ item.day }}</span>
              <span class="t-caption">{{ item.count }}</span>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="card" rounded="xl" variant="flat">
          <div class="stat-header">
            <div>
              <h2 class="t-h2">Monthly history</h2>
              <p class="t-caption">Completed tasks (last 6 months)</p>
            </div>
          </div>

          <div class="chart-bars">
            <div v-for="item in monthlyHistory" :key="item.label" class="bar-col">
              <div class="bar-fill" :style="{ height: monthHeight(item.count) + '%' }"></div>
              <span class="t-caption">{{ item.label }}</span>
              <span class="t-caption">{{ item.count }}</span>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="card" rounded="xl" variant="flat">
          <div class="stat-header">
            <div>
              <h2 class="t-h2">Tasks progress</h2>
              <p class="t-caption">Overall completion</p>
            </div>
          </div>

          <div class="chart-donut">
            <svg viewBox="0 0 36 36" class="chart-ring">
              <path
                class="ring-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
              />
              <path
                class="ring-segment ring-completed"
                :stroke-dasharray="tasksCompletionPercent + ', 100'"
                d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
              />
            </svg>

            <div class="donut-center">
              <span class="t-h2">{{ tasksCompletionPercent }}%</span>
              <span class="t-caption">completed</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import { useHabitsStore } from '../stores/habits'
import { useTasksStore } from '../stores/tasks'

export default {
  name: 'AnalyticsView',
  data() {
    return { habitsStore: null, tasksStore: null }
  },
  created() {
    this.habitsStore = useHabitsStore()
    this.tasksStore = useTasksStore()
    this.habitsStore.initFromStorage()
    this.tasksStore.initFromStorage()
  },
  computed: {
    activeTasksCount() { return this.tasksStore?.activeTasks?.length || 0 },
    completedTasksCount() { return this.tasksStore?.completedTasks?.length || 0 },
    tasksCompletionPercent() {
      const total = this.activeTasksCount + this.completedTasksCount
      return total === 0 ? 0 : Math.round((this.completedTasksCount / total) * 100)
    },
    highCount() { return this.tasksStore?.activeHigh?.length || 0 },
    mediumCount() { return this.tasksStore?.activeMedium?.length || 0 },
    lowCount() { return this.tasksStore?.activeLow?.length || 0 },
    totalActive() { return this.highCount + this.mediumCount + this.lowCount },
    highPercent() { return this.totalActive === 0 ? 0 : Math.round((this.highCount / this.totalActive) * 100) },
    mediumPercent() { return this.totalActive === 0 ? 0 : Math.round((this.mediumCount / this.totalActive) * 100) },
    lowPercent() { return this.totalActive === 0 ? 0 : Math.round((this.lowCount / this.totalActive) * 100) },
    weeklyCompleted() {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      return days.map(day => ({ day, count: Math.floor(Math.random() * 9) + 1 }))
    },
    mostProductiveDay() {
      if (this.weeklyCompleted.length === 0) return 'None'
      const maxItem = this.weeklyCompleted.reduce((a, b) => (a.count > b.count ? a : b))
      return maxItem.day
    },
    barHeight() {
      return count => {
        const max = Math.max(...this.weeklyCompleted.map(i => i.count), 1)
        return (count / max) * 100
      }
    },
    monthlyHistory() {
      const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return months.map(label => ({ label, count: Math.floor(Math.random() * 40) + 10 }))
    },
    monthHeight() {
      return count => {
        const max = Math.max(...this.monthlyHistory.map(i => i.count), 1)
        return (count / max) * 100
      }
    },
    currentStreak() {
      if (!this.habitsStore.completedDays) return 0
      const dates = Object.keys(this.habitsStore.completedDays)
        .filter(d => this.habitsStore.completedDays[d])
        .sort()
        .reverse()
      if (dates.length === 0 || dates[0] !== this.todayISO()) return 0
      let streak = 1
      for (let i = 1; i < dates.length; i++) {
        const diff = this.daysDiff(dates[i - 1], dates[i])
        if (diff === 1) streak++
        else break
      }
      return streak
    },
    averageWeekly() {
      if (!this.habitsStore.completedDays) return 0
      const dates = Object.keys(this.habitsStore.completedDays).filter(d => this.habitsStore.completedDays[d])
      const last28 = dates.filter(d => this.daysAgo(d) <= 28)
      return Math.round((last28.length / 28) * 100)
    }
  },
  methods: {
    todayISO(d) {
      const date = d || new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    daysAgo(dateStr) {
      const date = new Date(dateStr)
      const today = new Date()
      const diff = today - date
      return Math.floor(diff / 86400000)
    },
    daysDiff(date1, date2) {
      const d1 = new Date(date1)
      const d2 = new Date(date2)
      return Math.floor((d1 - d2) / 86400000)
    }
  }
}
</script>
