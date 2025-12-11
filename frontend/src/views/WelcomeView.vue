<template>
  <section class="welcome">
    <div class="welcome-overlay"></div>

    <div class="welcome-inner">
      <header class="welcome-header">
        <div class="logo-mark">HF</div>
        <div class="logo-text">Habit Flow</div>
      </header>

      <div class="welcome-layout">
        <div class="welcome-hero">
          <div class="hero-eyebrow">Your dreams are in your hands</div>

          <h1 class="hero-title">
            Create a routine that leads you to success.
          </h1>

          <p class="hero-text">
            Track habits, set weekly schedules, follow your progress and never let a day go to waste.
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
              @click="$emit('login')"
            >
              Log in
            </button>
          </div>
        </div>

        <div class="welcome-image"></div>
      </div>

      <footer class="welcome-footer">
        <p class="footer-text">
          DISCIPLINE · ROUTINE · RESULTS
        </p>
      </footer>
    </div>
  </section>
</template>

<script>
import '../assets/styles/welcome.css'

export default {
  name: 'WelcomeView',
  emits: ['start', 'login']
}
</script>
