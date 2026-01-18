import { useUsersStore } from '../stores/users'
import { normalizeEmail, normalizePassword, validateAuthFields } from '../utils/auth.js'

let usersBootstrapped = false

export default {
  data() {
    return {
      usersStore: useUsersStore(),
      error: '',
      emailError: '',
      passwordError: '',
      email: '',
      password: ''
    }
  },

  created() {
  
    if (!usersBootstrapped) {
      usersBootstrapped = true
      this.usersStore.load?.()
      this.usersStore.loadCurrentUser?.()
    }
  },

  methods: {
    setError(msg) {
      this.error = msg || 'Error'
    },

    clearError() {
      this.error = ''
      this.emailError = ''
      this.passwordError = ''
    },

    setFieldError(field, msg) {
      const text = msg || 'Error'
      if (field === 'email') this.emailError = text
      if (field === 'password') this.passwordError = text
    },

    normalizeEmail,
    normalizePassword,

    validateAuthFields() {
      return validateAuthFields(this.email, this.password)
    }
  }
}
