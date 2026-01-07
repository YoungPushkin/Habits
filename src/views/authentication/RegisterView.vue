<script>
import AuthBaseMixin from '../../mixins/AuthBase.mixin'
import { initAllStores } from '../../utils/bootstrap.js'
import AuthHero from '../../components/auth/AuthHero.vue'
import BaseCard from '../../components/global/BaseCard.vue'
import FormErrorAlert from '../../components/form/FormErrorAlert.vue'

export default {
  name: 'RegisterView',
  components: { AuthHero, BaseCard, FormErrorAlert },
  mixins: [AuthBaseMixin],
  emits: ['complete', 'back'],

  data() {
    return { name: '' }
  },

  methods: {
    onSubmit() {
      const name = String(this.name || '').trim()
      const check = this.validateAuthFields()

      if (!name) {
        this.setError('Name is required')
        return
      }
      if (!check.ok) {
        this.setError(check.message)
        return
      }

      const res = this.usersStore.register(name, check.email, check.password)
      if (!res.ok) {
        this.setError(res.error)
        return
      }

      initAllStores()

      this.clearError()
      this.$emit('complete')
    }
  }
}
</script>


<template>
  <section class="app-page auth-page auth-page--top">
    <AuthHero />

    <BaseCard
      title="Create account"
      subtitle="Join and start tracking your progress."
      card-class="auth-panel wide"
    >

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

        <FormErrorAlert :message="error" />

        <v-btn type="submit" color="primary" variant="flat" rounded="pill" block class="mb-3">
          Continue
        </v-btn>

        <v-btn variant="tonal" rounded="pill" block @click="$emit('back')">
          Back to welcome
        </v-btn>
      </v-form>
    </BaseCard>
  </section>
</template>
