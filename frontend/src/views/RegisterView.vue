<template>
  <section class="register">
    <div class="register-panel">
      <header class="register-header">
        <span class="logo-mark">HF</span>
        <span class="logo-text">Habit Flow</span>
      </header>

      <h2 class="register-title">Create your account</h2>
      <p class="register-subtitle">Start your journey to discipline and success.</p>

      <form class="register-form" @submit.prevent="$emit('complete')">
        <input v-model="name" type="text" class="register-input" placeholder="Your name" required />
        <input v-model="email" type="email" class="register-input" placeholder="Email" required />
        <input v-model="password" type="password" class="register-input" placeholder="Password" required />

        <button type="submit" class="register-btn">Continue</button>

        <button type="button" class="register-back" @click="$emit('back')">
          Back to welcome
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import '../assets/styles/Register.css'

export default {
  name: 'RegisterView',
  emits: ['complete', 'back'],
  data() {
    return {
      name: '',
      email: '',
      password: ''
    }
  }
}
</script>
