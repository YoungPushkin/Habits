<script>
export default {
  name: 'WelcomeView',
  emits: ['start', 'login']
}
</script>

<template>
  <section class="app-page">
    <v-container class="pa-0">
      <v-card class="card welcome-card" variant="tonal">
        <v-card-text>
          <div class="d-flex align-center ga-3 mb-8">
            <v-avatar size="42" color="primary" variant="tonal">
              <span class="logo-mark">HF</span>
            </v-avatar>
            <div class="logo-text">Habit Flow</div>
          </div>

          <v-row class="align-center" dense>
            <v-col cols="12" md="7">
              <div class="hero-eyebrow">Your dreams are in your hands</div>

              <h1 class="hero-title">
                Create a routine that leads you to success.
              </h1>

              <p class="hero-text">
                Track habits, set weekly schedules, follow your progress and never let a day go to waste.
              </p>

              <div class="d-flex ga-3 flex-wrap mt-6">
                <v-btn color="primary" variant="flat" rounded="pill" @click="$emit('start')">
                  Create account
                </v-btn>

                <v-btn color="primary" variant="tonal" rounded="pill" @click="$emit('login')">
                  Log in
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="5">
              <v-card class="welcome-visual" variant="tonal">
                <v-card-text class="welcome-visual-inner">
                  <div class="visual-ring"></div>
                  <div class="visual-lines"></div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <div class="mt-10 text-center">
            <div class="footer-text">
              DISCIPLINE · ROUTINE · RESULTS
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </section>
</template>

