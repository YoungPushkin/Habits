<script>
import AuthBaseMixin from '../../mixins/AuthBase.mixin'
import { initAllStores } from '../../utils/bootstrap.js'
import logo from '../../assets/images/logo.png'

export default {
  name: 'LoginView',
  mixins: [AuthBaseMixin],
  emits: ['back', 'loginSuccess'],

  data() {
    return { logo }
  },

  methods: {
    onSubmit() {
      const check = this.validateAuthFields()
      if (!check.ok) {
        this.setError(check.message)
        return
      }

      const res = this.usersStore.login(check.email, check.password)
      if (!res.ok) {
        this.setError(res.error)
        return
      }

      initAllStores()

      this.clearError()

   
      this.$emit('loginSuccess')

     
      this.$router.push('/dashboard')
    }
  }
}
</script>


<template>
  <section class="app-page auth-page auth-page--top">
    <div class="auth-hero">
      <img :src="logo" alt="Habit Flow logo" class="auth-logo" />
      <div class="logo-text">Habit Flow</div>
    </div>

    <v-card class="card auth-panel wide" variant="tonal">
      <v-card-text>

        <div class="t-h2 mb-1">Log in</div>
        <p class="t-sub mb-6">Continue with your personal routine.</p>

        <v-form @submit.prevent="onSubmit">
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
            autocomplete="current-password"
            hide-details="auto"
            class="mb-3"
          />

          <v-alert v-if="error" type="error" variant="tonal" density="comfortable" class="mb-4">
            {{ error }}
          </v-alert>

          <v-btn type="submit" color="primary" variant="flat" rounded="pill" block class="mb-3">
            Continue
          </v-btn>

          <v-btn variant="tonal" rounded="pill" block @click="$emit('back')">
            Back to welcome
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </section>
</template>
