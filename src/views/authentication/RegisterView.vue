<script>
import AuthBaseMixin from '../../mixins/AuthBase.mixin'
import { initAllStores } from '../../utils/bootstrap.js'
import AuthHero from '../../components/auth/AuthHero.vue'
import BaseCard from '../../components/global/BaseCard.vue'
import BaseButton from '../../components/global/BaseButton.vue'
import { BUTTON_LABELS } from '../../constants/buttons.js'

export default {
  name: 'RegisterView',
  components: { AuthHero, BaseCard, BaseButton },
  mixins: [AuthBaseMixin],
  emits: ['complete', 'back'],

  data() {
    return { name: '', nameError: '', buttonLabels: BUTTON_LABELS }
  },

  methods: {
    onSubmit() {
      this.clearError()
      this.nameError = ''
      const name = String(this.name || '').trim()
      const check = this.validateAuthFields()

      if (!name) {
        this.nameError = 'Name is required'
        return
      }
      if (!check.ok) {
        if (check.message) {
          if (check.message.toLowerCase().includes('email')) {
            this.setFieldError('email', check.message)
          } else {
            this.setFieldError('password', check.message)
          }
        }
        return
      }

      const res = this.usersStore.register(name, check.email, check.password)
      if (!res.ok) {
        if (res.error && res.error.toLowerCase().includes('user')) {
          this.setFieldError('email', res.error)
        } else {
          this.setFieldError('password', res.error)
        }
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
          :placeholder="nameError && !name ? nameError : ''"
          :error="!!nameError"
          hide-details="auto"
          class="mb-3"
          @update:modelValue="nameError = ''"
        />
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          variant="outlined"
          density="comfortable"
          autocomplete="email"
          :placeholder="emailError && !email ? emailError : ''"
          :error="!!emailError"
          hide-details="auto"
          class="mb-3"
          @update:modelValue="emailError = ''"
        />
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          variant="outlined"
          density="comfortable"
          autocomplete="new-password"
          :placeholder="passwordError && !password ? passwordError : ''"
          :error="!!passwordError"
          hide-details="auto"
          class="mb-3"
          @update:modelValue="passwordError = ''"
        />

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
