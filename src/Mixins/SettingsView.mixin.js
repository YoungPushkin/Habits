import { useHabitsStore } from '../stores/habits'
import { useTasksStore } from '../stores/tasks'
import { useUiStore } from '../stores/settings'

export default {
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
      const raw = localStorage.getItem('current_user_name')
      if (raw) return raw
      const email = this.userEmail || ''
      return email.includes('@') ? email.split('@')[0] : 'User'
    },
    initials() {
      const n = (this.userName || 'U').trim()
      return n.slice(0, 2).toUpperCase()
    },
    titleClass() {
      return this.ui.accent === 'silver' ? 'text-silver' : 'text-gold'
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
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result
        this.ui.setAvatar(typeof dataUrl === 'string' ? dataUrl : '')
      }
      reader.readAsDataURL(file)
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
      const tasksStore = useTasksStore()
      habitsStore.resetAll?.()
      if (Array.isArray(tasksStore.tasks)) tasksStore.tasks = []
      tasksStore.nextId = 1
      tasksStore.saveToStorage?.()
      this.showResetDialog = false
    }
  }
}
