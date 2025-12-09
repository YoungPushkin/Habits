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
          <span class="stat-value">68%</span>
          <span class="stat-sub">7 of 10 habits</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill"></div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Best streak</span>
          <span class="stat-tag">Discipline</span>
        </div>
        <div class="stat-main">
          <span class="stat-value">12 days</span>
          <span class="stat-sub">Longest chain</span>
        </div>
        <div class="streak-line">
          <span class="streak-dot active"></span>
          <span class="streak-dot active"></span>
          <span class="streak-dot active"></span>
          <span class="streak-dot active"></span>
          <span class="streak-dot"></span>
          <span class="streak-dot"></span>
          <span class="streak-dot"></span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Tasks done</span>
          <span class="stat-tag">Today</span>
        </div>
        <div class="stat-main">
          <span class="stat-value">5</span>
          <span class="stat-sub">of 8 tasks</span>
        </div>
        <div class="tasks-bars">
          <span class="task-bar active"></span>
          <span class="task-bar active"></span>
          <span class="task-bar active"></span>
          <span class="task-bar active"></span>
          <span class="task-bar"></span>
        </div>
      </div>
    </div>

    <div class="middle-row">
      <div class="card large">
        <div class="card-header">
          <div>
            <h2 class="card-title">Habits for today</h2>
            <p class="card-subtitle">Keep your promises to yourself.</p>
          </div>
          <button type="button" class="ghost-btn">
            <i class="bi bi-plus-lg"></i>
            Add habit
          </button>
        </div>

        <ul class="habit-list">
          <li class="habit-item">
            <div class="habit-main">
              <div class="habit-check active"></div>
              <div class="habit-text">
                <span class="habit-name">Morning workout</span>
                <span class="habit-meta">Daily · 06:30</span>
              </div>
            </div>
            <span class="habit-status done">Done</span>
          </li>

          <li class="habit-item">
            <div class="habit-main">
              <div class="habit-check"></div>
              <div class="habit-text">
                <span class="habit-name">Read 20 pages</span>
                <span class="habit-meta">Evening · Focus</span>
              </div>
            </div>
            <span class="habit-status pending">Pending</span>
          </li>

          <li class="habit-item">
            <div class="habit-main">
              <div class="habit-check"></div>
              <div class="habit-text">
                <span class="habit-name">Plan tomorrow</span>
                <span class="habit-meta">Night · Reflection</span>
              </div>
            </div>
            <span class="habit-status upcoming">Upcoming</span>
          </li>
        </ul>
      </div>

      <div class="card medium">
        <div class="card-header">
          <div>
            <h2 class="card-title">Week progress</h2>
            <p class="card-subtitle">Completion by day.</p>
          </div>
          <div class="pill-switch">
            <button type="button" class="pill active">Week</button>
            <button type="button" class="pill">Month</button>
          </div>
        </div>

        <div class="chart-bars">
          <div class="chart-bar">
            <div class="bar bar-70"></div>
            <span class="bar-label">Mon</span>
          </div>
          <div class="chart-bar">
            <div class="bar bar-40"></div>
            <span class="bar-label">Tue</span>
          </div>
          <div class="chart-bar">
            <div class="bar bar-90"></div>
            <span class="bar-label">Wed</span>
          </div>
          <div class="chart-bar">
            <div class="bar bar-60"></div>
            <span class="bar-label">Thu</span>
          </div>
          <div class="chart-bar">
            <div class="bar bar-80"></div>
            <span class="bar-label">Fri</span>
          </div>
          <div class="chart-bar">
            <div class="bar bar-30"></div>
            <span class="bar-label">Sat</span>
          </div>
          <div class="chart-bar">
            <div class="bar bar-50"></div>
            <span class="bar-label">Sun</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-row">
      <div class="card wide">
        <div class="card-header">
          <div>
            <h2 class="card-title">Activity streak</h2>
            <p class="card-subtitle">Visual map of your consistency.</p>
          </div>
          <button type="button" class="ghost-btn">
            View full analytics
          </button>
        </div>

        <div class="heatmap">
          <div class="heat-row" v-for="row in 4" :key="row">
            <span
              v-for="col in 14"
              :key="col"
              class="heat-cell"
              :class="heatLevel(row, col)"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import '../assets/styles/dashboard.css'

export default {
  name: 'DashboardView',
  methods: {
    heatLevel(row, col) {
      const value = (row * 7 + col) % 5
      if (value === 0) return 'lvl-0'
      if (value === 1) return 'lvl-1'
      if (value === 2) return 'lvl-2'
      if (value === 3) return 'lvl-3'
      return 'lvl-4'
    }
  }
}
</script>
