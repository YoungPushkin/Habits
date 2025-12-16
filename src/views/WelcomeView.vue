<template>
  <section class="welcome app-page">
    <v-container class="pa-0">
      <v-card class="hf-card welcome-card" variant="tonal">
        <v-card-text class="welcome-inner">
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

<script>
export default {
  name: 'WelcomeView',
  emits: ['start', 'login']
}
</script>

<style scoped>
.welcome-card {
  max-width: 1100px;
  margin: 0 auto;
}

.logo-mark {
  font-weight: 800;
  letter-spacing: 0.08em;
}

.logo-text {
  font-family: "Playfair Display", serif;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 14px;
}

.hero-eyebrow {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(245, 245, 245, 0.72);
  margin-bottom: 10px;
}

.hero-title {
  font-family: "Playfair Display", serif;
  font-size: 34px;
  line-height: 1.15;
  margin: 0 0 12px 0;
}

.hero-text {
  margin: 0;
  color: rgba(245, 245, 245, 0.72);
  font-size: 14px;
  line-height: 1.6;
  max-width: 52ch;
}

.welcome-visual {
  border-radius: 18px;
  height: 260px;
  overflow: hidden;
}

.welcome-visual-inner {
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-ring {
  width: 170px;
  height: 170px;
  border-radius: 999px;
  border: 1px solid rgba(212, 175, 55, 0.35);
  background: radial-gradient(circle at center, rgba(212, 175, 55, 0.18), transparent 60%);
  box-shadow: 0 0 50px rgba(212, 175, 55, 0.12);
}

.visual-lines {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.10) 50%, transparent 100%),
    linear-gradient(180deg, transparent 0%, rgba(212,175,55,0.06) 50%, transparent 100%);
  mask-image: radial-gradient(circle at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 70%);
}

.footer-text {
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(245, 245, 245, 0.65);
}
</style>
