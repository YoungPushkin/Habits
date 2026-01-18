import { useUsersStore } from '../stores/users'
import { useUiStore } from '../stores/settings'
import { resetAllStores } from '../utils/bootstrap.js'
import { deriveUserName, deriveInitials } from '../utils/auth.js'

export default {
  data() {
    return {
      ui: useUiStore(),
      usersStore: useUsersStore(),

      showPasswordModal: false,
      showResetDialog: false,
      newPassword: '',
      confirmPassword: '',
      newPasswordError: '',
      confirmPasswordError: ''
    }
  },

  computed: {
    currentUser() {
      return this.usersStore.currentUser || null
    },

    userEmail() {
      return this.currentUser?.email || ''
    },

    userName() {
      return deriveUserName(this.currentUser)
    },

    initials() {
      return deriveInitials(this.userName)
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

    openChangePassword() {
      this.clearPasswordError()
      this.newPassword = ''
      this.confirmPassword = ''
      this.showPasswordModal = true
    },

    closeChangePassword() {
      this.clearPasswordError()
      this.showPasswordModal = false
      this.newPassword = ''
      this.confirmPassword = ''
    },

    setPasswordError(msg, field = 'new') {
      const text = msg || 'Error'
      if (field === 'confirm') {
        this.confirmPasswordError = text
      } else {
        this.newPasswordError = text
      }
    },

    clearPasswordError() {
      this.newPasswordError = ''
      this.confirmPasswordError = ''
    },

    submitPasswordChange() {
      const p1 = String(this.newPassword || '').trim()
      const p2 = String(this.confirmPassword || '').trim()

      if (!p1 || p1.length < 4) {
        this.setPasswordError('Password is too short', 'new')
        return
      }
      if (p1 !== p2) {
        this.setPasswordError('Passwords do not match', 'confirm')
        return
      }

      const res = this.usersStore.changePassword?.(p1)
      if (res && res.ok === false) {
        this.setPasswordError(res.error || 'Error', 'new')
        return
      }

      this.ui.showToast?.('Password updated', 'success')
      this.closeChangePassword()
    },

    confirmReset() {
      this.showResetDialog = true
    },

    cancelReset() {
      this.showResetDialog = false
    },

    resetAll() {
      resetAllStores()
      this.ui.showToast?.('All data reset', 'info')
      this.showResetDialog = false
    }
  }
}
