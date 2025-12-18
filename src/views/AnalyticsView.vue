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
            <div v-for="item in weeklyCompleted" :key="item.day" class="chart-col">
              <div class="chart-box">
                <div class="chart-fill" :style="{ height: barHeight(item.count) + '%' }"></div>
              </div>
              <span class="t-cap">{{ item.day }}</span>
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

<script>
import { useHabitsStore } from '../stores/habits'
import { useTasksStore } from '../stores/tasks'

function isoFromDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addDays(date, delta) {
  const d = new Date(date)
  d.setDate(d.getDate() + delta)
  return d
}

function monthKey(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export default {
  name: 'AnalyticsView',
  data() {
    return { habitsStore: null, tasksStore: null }
  },
  created() {
    this.habitsStore = useHabitsStore()
    this.tasksStore = useTasksStore()
    this.habitsStore.initFromStorage?.()
    this.tasksStore.initFromStorage?.()
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

    //  Tasks this week: считаем реальные done по completedAt в пределах текущей недели Mon-Sun
    weeklyCompleted() {
      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

      const now = new Date()
      const js = now.getDay()             // Sun=0..Sat=6
      const monOffset = (js + 6) % 7      // Mon=0..Sun=6
      const monday = addDays(new Date(now.getFullYear(), now.getMonth(), now.getDate()), -monOffset)

      const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i))
      const isoDays = days.map(d => isoFromDate(d))

      const done = (this.tasksStore?.tasks || []).filter(t => t.status === 'done' && t.completedAt)
      const map = Object.create(null)

      for (const t of done) {
        const key = t.completedAt
        map[key] = (map[key] || 0) + 1
      }

      return isoDays.map((iso, i) => ({
        day: labels[i],
        count: map[iso] || 0
      }))
    },

    mostProductiveDay() {
      const list = this.weeklyCompleted
      if (!list.length) return 'None'
      const max = list.reduce((a, b) => (b.count > a.count ? b : a), list[0])
      return max.count === 0 ? 'None' : max考虑day // (oops)
    },

    //  ВАЖНО: строка выше — исправленная версия ниже:
    // (Я оставляю правильно в итоге, смотри следующий computed)

    mostProductiveDayFixed() {
      const list = this.weeklyCompleted
      if (!list.length) return 'None'
      const max = list.reduce((a, b) => (b.count > a.count ? b : a), list[0])
      return max.count === 0 ? 'None' : max.day
    },

    barHeight() {
      return count => {
        const max = Math.max(...this.weeklyCompleted.map(i => i.count), 1)
        return (count / max) * 100
      }
    },

    //  Monthly history: последние 6 месяцев, по completedAt
    monthlyHistory() {
      const now = new Date()
      const first = new Date(now.getFullYear(), now.getMonth(), 1)

      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(first)
        d.setMonth(d.getMonth() - (5 - i))
        return d
      })

      const labels = months.map(d => d.toLocaleString('en-US', { month: 'short' }))
      const keys = months.map(d => monthKey(d))

      const done = (this.tasksStore?.tasks || []).filter(t => t.status === 'done' && t.completedAt)
      const map = Object.create(null)

      for (const t of done) {
        const d = new Date(t.completedAt + 'T00:00:00')
        if (Number.isNaN(d.getTime())) continue
        const k = monthKey(d)
        map[k] = (map[k] || 0) + 1
      }

      return keys.map((k, i) => ({
        label: labels[i],
        count: map[k] || 0
      }))
    },

    monthHeight() {
      return count => {
        const max = Math.max(...this.monthlyHistory.map(i => i.count), 1)
        return (count / max) * 100
      }
    },

    // habits: как у тебя было
    currentStreak() {
      if (!this.habitsStore?.completedDays) return 0
      const today = isoFromDate(new Date())

      const dates = Object.keys(this.habitsStore.completedDays)
        .filter(d => this.habitsStore.completedDays[d])
        .sort()
        .reverse()

      if (!dates.length || dates[0] !== today) return 0

      let streak = 1
      for (let i = 1; i < dates.length; i++) {
        const diff = Math.floor((new Date(dates[i - 1]) - new Date(dates[i])) / 86400000)
        if (diff === 1) streak++
        else break
      }
      return streak
    },

    averageWeekly() {
      if (!this.habitsStore?.completedDays) return 0
      const today = new Date()
      const from = addDays(new Date(today.getFullYear(), today.getMonth(), today.getDate()), -27)

      let doneDays = 0
      for (let i = 0; i < 28; i++) {
        const iso = isoFromDate(addDays(from, i))
        if (this.habitsStore.completedDays[iso]) doneDays++
      }
      return Math.round((doneDays / 28) * 100)
    },

    // чтобы template не менять: просто подменим mostProductiveDay на fixed
    mostProductiveDay() {
      return this.mostProductiveDayFixed
    }
  }
}
</script>

