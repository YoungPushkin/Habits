import { useUsersStore } from '../stores/users'

export default {
  data() {
    return {
      usersStore: useUsersStore(),
      error: '',
      email: '',
      password: ''
    }
  },

  created() {
    this.usersStore.load()
    this.usersStore.loadCurrentUser()
  },

  methods: {
    clearError() {
      this.error = ''
    },

    setError(msg) {
      this.error = msg || 'Error'
    },

    normalizeEmail(val) {
      return (val || '').trim().toLowerCase()
    },

    normalizePassword(val) {
      return (val || '').trim()
    }
  }
}
