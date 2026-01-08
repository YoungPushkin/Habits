<script>
import AuthHero from '../../components/auth/AuthHero.vue'
import BaseButton from '../../components/global/BaseButton.vue'
import { BUTTON_LABELS } from '../../constants/buttons.js'

export default {
  name: 'WelcomeView',
  components: { AuthHero, BaseButton },
  computed: {
    buttonLabels() { return BUTTON_LABELS }
  },
  emits: ['start', 'login']
}
</script>

<template>
  <section class="app-page auth-page auth-page--top welcome-page">
    <v-container class="pa-0" fluid>
      <AuthHero wrapper-class="welcome-hero" img-class="welcome-logo" />

      <div class="welcome-card welcome-plain">
        <v-row class="align-center" dense>
          <v-col cols="12" md="7" class="welcome-copy">
            <div class="hero-eyebrow">Your dreams are in your hands</div>

            <h1 class="hero-title">
              Create a routine that leads you to success.
            </h1>

            <p class="hero-text">
              Track habits, set weekly schedules, follow your progress and never let a day go to waste.
            </p>

            <div class="hero-actions">
              <BaseButton color="primary" variant="flat" rounded="pill" @click="$emit('start')">
                {{ buttonLabels.createAccount }}
              </BaseButton>

              <BaseButton color="primary" variant="tonal" rounded="pill" @click="$emit('login')">
                {{ buttonLabels.logIn }}
              </BaseButton>
            </div>
          </v-col>

          <v-col cols="12" md="5">
            <div class="career-icons">
              <div class="icon-pill">
                <i class="bi bi-graph-up-arrow"></i>
              </div>
            </div>
          </v-col>
        </v-row>

        <div class="welcome-footer">
          <div class="footer-text text-gold">
            DISCIPLINE -> ROUTINE -> RESULTS
          </div>
        </div>
      </div>
    </v-container>
  </section>
</template>

