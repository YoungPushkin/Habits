<script>
import AuthBaseMixin from '../../mixins/AuthBase.mixin'
import { initAllStores } from '../../utils/bootstrap.js'
import AuthHero from '../../components/auth/AuthHero.vue'
import BaseCard from '../../components/global/BaseCard.vue'
import FormErrorAlert from '../../components/form/FormErrorAlert.vue'
import BaseButton from '../../components/global/BaseButton.vue'
import { BUTTON_LABELS } from '../../constants/buttons.js'

export default {
  name: 'LoginView',
  components: { AuthHero, BaseCard, FormErrorAlert, BaseButton },
  mixins: [AuthBaseMixin],
  emits: ['back', 'loginSuccess'],
  data() {
    return { buttonLabels: BUTTON_LABELS }
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
    <AuthHero />

    <BaseCard
      title="Log in"
      subtitle="Continue with your personal routine."
      card-class="auth-panel wide"
    >

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

        <FormErrorAlert :message="error" />

        <BaseButton type="submit" color="primary" variant="flat" rounded="pill" block class="mb-3">
          {{ buttonLabels.continue }}
        </BaseButton>

        <BaseButton variant="tonal" rounded="pill" block @click="$emit('back')">
          {{ buttonLabels.backToWelcome }}
        </BaseButton>
      </v-form>
    </BaseCard>
  </section>
</template>
