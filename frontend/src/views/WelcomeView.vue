<template>
  <div class="welcome">
    <div class="welcome__overlay"></div>

    <div class="welcome__content">
      <div class="welcome__logo">
        <span class="welcome__logo-mark">HF</span>
        <span class="welcome__logo-text">Habit Flow</span>
      </div>

      <div class="welcome__main">
        <p class="welcome__eyebrow">Your future starts now</p>
        <h1 class="welcome__title">
          Your desires<br />
          are in your hands.
        </h1>
        <p class="welcome__subtitle">
          Turn habits and tasks into a clear system. Track your progress by days, weeks and months in a calm, premium space.
        </p>

        <div class="welcome__actions">
          <button
            type="button"
            class="welcome__button welcome__button--primary"
            @click="$emit('start')"
          >
            Create account
          </button>

          <button
            type="button"
            class="welcome__button welcome__button--secondary"
          >
            I already have an account
          </button>
        </div>
      </div>

      <div class="welcome__bottom">
        <span class="welcome__hint">
          Your habits. Your tasks. Your rules.
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/styles/welcome.css'

export default {
  name: 'WelcomeView',
  emits: ['start']
}
</script>