<template>
  <section class="register app-page">
    <v-card class="hf-card register-panel" variant="tonal">
      <v-card-text>
        <div class="d-flex align-center ga-3 mb-6">
          <v-avatar size="38" variant="tonal" color="primary">
            <span class="logo-mark">HF</span>
          </v-avatar>
          <div class="logo-text">Habit Flow</div>
        </div>

        <div class="t-h2 mb-1">Create your account</div>
        <div class="t-subtitle mb-6">Start your journey to discipline and success.</div>

        <v-form @submit.prevent="onSubmit">
          <v-text-field
            v-model="name"
            label="Your name"
            type="text"
            variant="outlined"
            density="comfortable"
            autocomplete="name"
            hide-details="auto"
            class="mb-3"
          />

          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            variant="outlined"
            density="comfortable"
            autocomplete="email"
            hide-details="auto"
            class="mb-3"
          />

          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            variant="outlined"
            density="comfortable"
            autocomplete="new-password"
            hide-details="auto"
            class="mb-3"
          />

          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            density="comfortable"
            class="mb-4"
          >
            {{ error }}
          </v-alert>

          <v-btn
            type="submit"
            color="primary"
            variant="flat"
            rounded="pill"
            block
            class="mb-3"
          >
            Continue
          </v-btn>

          <v-btn
            variant="tonal"
            rounded="pill"
            block
            @click="$emit('back')"
          >
            Back to welcome
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </section>
</template>

<script>
import { useHabitsStore } from '../stores/habits.js'

export default {
  name: 'RegisterView',
  emits: ['complete', 'back'],
  data() {
    return {
      name: '',
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    onSubmit() {
      const name = (this.name || '').trim()
      const email = (this.email || '').trim().toLowerCase()
      const password = (this.password || '').trim()

      if (!name || !email || !password) {
        this.error = 'Please fill all fields'
        return
      }

      let users = []
      const raw = localStorage.getItem('users_db')
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) users = parsed
        } catch (e) {}
      }

      if (users.some(u => u.email === email)) {
        this.error = 'Account with this email already exists'
        return
      }

      users.push({ name, email, password })
      localStorage.setItem('users_db', JSON.stringify(users))
      localStorage.setItem('current_user_email', email)
      localStorage.setItem('current_user_name', name)

      const habitsStore = useHabitsStore()
      habitsStore.initFromStorage?.()

      this.error = ''
      this.$emit('complete')
    }
  }
}
</script>

<style scoped>
.register-panel {
  max-width: 520px;
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
</style>
