<script>
import AuthBaseMixin from '../../mixins/AuthBase.mixin'
import { useHabitsStore } from '../../stores/habits'
import { useTasksStore } from '../../stores/tasks'
import { useUiStore } from '../../stores/settings'

export default {
  name: 'RegisterView',
  mixins: [AuthBaseMixin],
  emits: ['complete', 'back'],

  data() {
    return { name: '' }
  },

  methods: {
    onSubmit() {
      const res = this.usersStore.register(this.name, this.email, this.password)
      if (!res.ok) {
        this.setError(res.error)
        return
      }

      useUiStore().initFromStorage?.()
      useHabitsStore().initFromStorage?.()
      useTasksStore().initFromStorage?.()

      this.clearError()
      this.$emit('complete')
    }
  }
}
</script>


<template>
  <section class="app-page">
    <v-card class="card auth-panel" variant="tonal">
      <v-card-text>
      
        <v-form @submit.prevent="onSubmit">
          <v-text-field v-model="name" label="Your name" type="text" variant="outlined" density="comfortable"
            autocomplete="name" hide-details="auto" class="mb-3"
          />
          <v-text-field v-model="email" label="Email" type="email" variant="outlined" density="comfortable"
            autocomplete="email" hide-details="auto" class="mb-3"
          />
          <v-text-field v-model="password" label="Password" type="password" variant="outlined" density="comfortable"
            autocomplete="new-password" hide-details="auto" class="mb-3"
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
