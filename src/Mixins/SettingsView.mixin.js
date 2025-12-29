import { useUiStore } from '../stores/settings'
import { useHabitsStore } from '../stores/habits'
import { useTasksStore } from '../stores/tasks'

export default {
  name: 'SettingsView',

  data() {
    return {
      ui: useUiStore(),

      showPasswordModal: false,
      showResetDialog: false,
      newPassword: '',
      confirmPassword: '',
      passwordError: ''
    }
  },

  created() {
    this.ui.initFromStorage?.()
  },

  computed: {
    userEmail() {
      return localStorage.getItem('current_user_email') || 'guest@example.com'
    },

    userName() {
      const rawUsers = localStorage.getItem('users_db')
      const email = this.userEmail

      try {
        const users = JSON.parse(rawUsers || '[]')
        const user = Array.isArray(users) ? users.find(u => (u.email || '').toLowerCase() === email.toLowerCase()) : null
        if (user?.name) return user.name
      } catch (e) {}

      return email.includes('@') ? email.split('@')[0] : 'User'
    },

    initials() {
      const n = String(this.userName || 'U').trim()
      return n.slice(0, 2).toUpperCase()
    }
  },

  methods: {
    pickAvatar() {
      this.$refs.fileInput?.click()
    },

    onAvatarFile(e) {
      const file = e?.target?.files?.[0]
      if (!file) return
      e.target.value = ''

      if (!file.type || !file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result
        this.ui.setAvatar(typeof dataUrl === 'string' ? dataUrl : '')
      }
      reader.readAsDataURL(file)
    },

  
    onAccentChange(val) {
      this.ui.setAccent(val)
    },

    openChangePassword() {
      this.showPasswordModal = true
      this.passwordError = ''
      this.newPassword = ''
      this.confirmPassword = ''
    },

    changePassword() {
      if ((this.newPassword || '').length < 6) {
        this.passwordError = 'Password must be at least 6 characters'
        return
      }
      if (this.newPassword !== this.confirmPassword) {
        this.passwordError = 'Passwords do not match'
        return
      }

      this.passwordError = ''
      this.showPasswordModal = false
      this.newPassword = ''
      this.confirmPassword = ''
    },

    confirmReset() {
      this.showResetDialog = true
    },

    resetAll() {
     
      const habitsStore = useHabitsStore()
      habitsStore.resetAll?.()

      const tasksStore = useTasksStore()
      tasksStore.resetAll?.() 

      this.showResetDialog = false
    }
  }
}

