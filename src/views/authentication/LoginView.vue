<script>
import AuthBaseMixin from '../../mixins/AuthBase.mixin'
import { useHabitsStore } from '../../stores/habits'
import { useTasksStore } from '../../stores/tasks'
import { useUiStore } from '../../stores/settings'

export default {
  name: 'LoginView',
  mixins: [AuthBaseMixin],
  emits: ['back', 'loginSuccess'],

  methods: {
    onSubmit() {
      const res = this.usersStore.login(this.email, this.password)
      if (!res.ok) {
        this.setError(res.error)
        return
      }

      useUiStore().initFromStorage?.()
      useHabitsStore().initFromStorage?.()
      useTasksStore().initFromStorage?.()

      this.clearError()

   
      this.$emit('loginSuccess')

     
      this.$router.push('/dashboard')
    }
  }
}
</script>


<template>
  <section class="app-page">
    <v-card class="card auth-panel" variant="tonal">
      <v-card-text>
        <div class="d-flex align-center ga-3 mb-6">
          <v-avatar size="38" variant="tonal" color="primary">
            <span class="logo-mark">HF</span>
          </v-avatar>
          <div class="logo-text">Habit Flow</div>
        </div>

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
