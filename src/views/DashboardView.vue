<template>
  <section class="dashboard">
    <div class="top-row">
      <div class="title-block">
        <h1 class="title">Today overview</h1>
        <p class="subtitle">Habits, tasks and progress for your day.</p>
      </div>

      <div class="top-meta">
        <div class="meta-chip">
          <span class="meta-label">Focus mode</span>
          <span class="meta-dot"></span>
          <span class="meta-value">On</span>
        </div>

        <div class="meta-date">
          <i class="bi bi-calendar2"></i>
          <span>Today</span>
        </div>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Day completion</span>
          <span class="stat-tag">Habits</span>
        </div>
        <div class="stat-main">
          <span class="stat-value">{{ store.completionPercent }}%</span>
          <span class="stat-sub">{{ store.todayDone }} of {{ store.todayTotal }} habits</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: store.completionPercent + '%' }"></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Best streak</span>
          <span class="stat-tag">Discipline</span>
        </div>
        <div class="stat-main">
          <span class="stat-value">{{ bestStreak }} days</span>
          <span class="stat-sub">Longest chain</span>
        </div>
        <div class="streak-line">
          <span v-for="n in 7" :key="n" class="streak-dot" :class="{ active: n <= bestStreakDisplay }"></span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Tasks done</span>
          <span class="stat-tag">Today</span>
        </div>
        <div class="stat-main">
          <span class="stat-value">{{ store.todayDone }}</span>
          <span class="stat-sub">of {{ store.todayTotal }} tasks</span>
        </div>
        <div class="tasks-bars">
          <span
            v-for="n in 5"
            :key="n"
            class="task-bar"
            :class="{ active: n <= Math.min(4, Math.round(store.completionPercent / 25)) }"
          ></span>
        </div>
      </div>
    </div>

    <div class="middle-row">
      <div class="dash-card dash-card-large">
        <div class="dash-card-header">
          <div>
            <h2 class="dash-card-title">Habits for today</h2>
            <p class="dash-card-subtitle">Keep your promises to yourself.</p>
          </div>
        </div>

        <ul class="habit-list">
          <li v-if="store.habits.length === 0" class="habit-item">
            <div class="habit-main">No habits yet</div>
          </li>

          <li v-for="h in store.habits" :key="h.id" class="habit-item">
            <div class="habit-main">
              <div class="habit-check" :class="{ active: h.doneToday }" @click="toggle(h.id)">
                <i v-if="h.doneToday" class="bi bi-check-lg" style="font-size:12px;color:#050505"></i>
              </div>

              <div class="habit-text">
                <span class="habit-name">{{ h.name }}</span>
                <span class="habit-meta">{{ h.meta }}</span>
              </div>
            </div>

            <div class="habit-actions">
              <button class="ghost-btn" @click="remove(h.id)">Remove</button>
              <span class="habit-status" :class="h.doneToday ? 'done' : 'pending'">
                {{ h.doneToday ? 'Done' : 'Pending' }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <div class="dash-card dash-card-medium">
        <div class="dash-card-header">
          <div>
            <h2 class="dash-card-title">Activity</h2>
            <p class="dash-card-subtitle">Days with at least one completed habit.</p>
          </div>
        </div>

        <div class="circle-block">
          <div class="circle-progress">
            <div class="circle-progress-inner" :style="circleStyle"></div>
            <div class="circle-progress-center">
              <span class="circle-progress-value">{{ activeDays }}</span>
              <span class="circle-progress-label">active days</span>
            </div>
          </div>
          <p class="circle-caption">
            One day is counted once, even if you complete several habits.
          </p>
        </div>
      </div>
    </div>

    <div class="bottom-row">
      <div class="dash-card dash-card-wide">
        <div class="dash-card-header">
          <div>
            <h2 class="dash-card-title">Activity streak</h2>
            <p class="dash-card-subtitle">Visual map of your consistency.</p>
          </div>
          <button type="button" class="ghost-btn" @click="resetAll">Reset</button>
        </div>

        <div class="heatmap">
          <div class="heat-row" v-for="r in store.activityGridRows" :key="r">
            <span
              v-for="c in store.activityGridCols"
              :key="c"
              class="heat-cell"
              :class="heatClass(r, c)"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import '../assets/styles/dashboard.css'
import { useHabitsStore } from '../stores/habits'

export default {
  name: 'DashboardView',
  data() {
    return {
      store: null
    }
  },
  created() {
    this.store = useHabitsStore()
  },
  methods: {
    toggle(id) {
      this.store.toggleHabit(id)
    },
    remove(id) {
      const idx = this.store.habits.findIndex(h => h.id === id)
      if (idx !== -1) this.store.habits.splice(idx, 1)
      this.store.updateCompletedDay()
    },
    resetAll() {
      this.store.resetAll()
    },
    shortDay(i) {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]
    },
    heatClass(r, c) {
      const v = (r * 7 + c) % 5
      return v === 0 ? 'lvl-0' : v === 1 ? 'lvl-1' : v === 2 ? 'lvl-2' : v === 3 ? 'lvl-3' : 'lvl-4'
    }
  },
  computed: {
    bestStreak() {
      return this.store.bestStreak || 0
    },
    bestStreakDisplay() {
      return Math.min(7, this.bestStreak)
    },
    activeDays() {
      return this.store.activeDays || 0
    },
    circleStyle() {
      const max = 7
      const p = Math.max(0, Math.min(1, this.activeDays / max))
      const deg = Math.round(p * 360)
      return {
        background: `conic-gradient(#d4af37 0deg ${deg}deg, #1a1a1a ${deg}deg 360deg)`
      }
    }
  }
}
</script>
