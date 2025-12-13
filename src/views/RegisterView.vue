<template>
  <section class="register">
    <div class="register-panel">
      <header class="register-header">
        <span class="logo-mark">HF</span>
        <span class="logo-text">Habit Flow</span>
      </header>

      <h2 class="register-title">Create your account</h2>
      <p class="register-subtitle">Start your journey to discipline and success.</p>

      <form class="register-form" @submit.prevent="onSubmit">
        <input
          v-model="name"
          type="text"
          class="register-input"
          placeholder="Your name"
          required
        />
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
      const name = this.name.trim()
      const email = this.email.trim().toLowerCase()
      const password = this.password.trim()

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

      const habitsStore = useHabitsStore()
      habitsStore.initFromStorage()

      this.error = ''
      this.$emit('complete')
    }
  }
}
</script>
