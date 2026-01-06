<script>
import logo from '../../assets/images/logo.png'

export default {
  name: 'WelcomeView',
  emits: ['start', 'login'],
  data() {
    return { logo }
  }
}
</script>

<template>
  <section class="app-page auth-page welcome-page">
    <v-container class="pa-0">
      <div class="welcome-hero d-flex align-center justify-center ga-3 mb-4">
        <img :src="logo" alt="Habit Flow logo" class="welcome-logo" />
        <div class="logo-text">Habit Flow</div>
      </div>

      <v-card class="card welcome-card" variant="tonal">
        <v-card-text>
          <v-row class="align-center welcome-content" dense>
            <v-col cols="12" md="7" class="welcome-copy">
              <div class="hero-eyebrow">Your dreams are in your hands</div>

              <h1 class="hero-title">
                Create a routine that leads you to success.
              </h1>

              <p class="hero-text">
                Track habits, set weekly schedules, follow your progress and never let a day go to waste.
              </p>

              <div class="d-flex ga-3 flex-wrap mt-6 justify-start">
                <v-btn color="primary" variant="flat" rounded="pill" @click="$emit('start')">
                  Create account
                </v-btn>

                <v-btn color="primary" variant="tonal" rounded="pill" @click="$emit('login')">
                  Log in
                </v-btn>
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

          <div class="mt-4 text-center">
            <div class="footer-text">
              DISCIPLINE · ROUTINE · RESULTS
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </section>
</template>

