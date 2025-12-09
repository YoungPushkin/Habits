<template>
  <section class="welcome">
    <div class="welcome-overlay"></div>

    <div class="welcome-inner">
      <header class="welcome-header">
        <span class="logo-mark">HF</span>
        <span class="logo-text">Habit Flow</span>
      </header>

      <div class="welcome-layout">
        <main class="welcome-hero">
          <p class="hero-eyebrow">Your future starts now</p>

          <h1 class="hero-title">
            Your desires<br />
            are in your hands.
          </h1>

          <p class="hero-text">
            Turn habits and tasks into a clear system. Track your progress by days,
            weeks and months in a calm, premium space.
          </p>

          <div class="hero-actions">
            <button
              type="button"
              class="btn btn-primary"
              @click="$emit('start')"
            >
              Create account
            </button>

            <button
              type="button"
              class="btn btn-outline"
            >
              I already have an account
            </button>
          </div>
        </main>

        <aside class="welcome-image"></aside>
      </div>

      <footer class="welcome-footer">
        <span class="footer-text">
          Your habits. Your tasks. Your rules.
        </span>
      </footer>
    </div>
  </section>
</template>

<script>
import '../assets/styles/welcome.css'

export default {
  name: 'WelcomeView',
  emits: ['start']
}
</script>
