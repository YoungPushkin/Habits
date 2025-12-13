<template>
  <section class="register">
    <div class="register-panel">
      <header class="register-header">
        <span class="logo-mark">HF</span>
        <span class="logo-text">Habit Flow</span>
      </header>

      <h2 class="register-title">Log in</h2>
      <p class="register-subtitle">Continue with your personal routine.</p>

      <form class="register-form" @submit.prevent="onSubmit">
        <input
          v-model="email"
          type="email"
          class="register-input"
          placeholder="Email"
          required
        />
        <input
          v-model="password"
          type="password"
          class="register-input"
          placeholder="Password"
          required
        />

        <p v-if="error" class="register-error">
          {{ error }}
        </p>

        <button type="submit" class="register-btn">
          Continue
        </button>

        <button
          type="button"
          class="register-back"
          @click="$emit('back')"
        >
          Back to welcome
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import '../assets/styles/register.css'
import { useHabitsStore } from '../stores/habits.js'

export default {
  name: 'LoginView',
  emits: ['loginSuccess', 'back'],
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    onSubmit() {
      const email = this.email.trim().toLowerCase()
      const password = this.password.trim()

      if (!email || !password) {
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

      const user = users.find(u => u.email === email && u.password === password)
      if (!user) {
        this.error = 'Wrong email or password'
        return
      }

      localStorage.setItem('current_user_email', email)

      const habitsStore = useHabitsStore()
      habitsStore.initFromStorage()

      this.error = ''
      this.$emit('loginSuccess')
    }
  }
}
</script>
