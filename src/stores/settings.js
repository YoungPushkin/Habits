import { defineStore } from 'pinia'

function storageKey(key) {
  const email = localStorage.getItem('current_user_email') || 'guest'
  return `${key}_${email}`
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    avatarDataUrl: '',
    accent: 'gold'
  }),
  actions: {
    initFromStorage() {
      this.avatarDataUrl = localStorage.getItem(storageKey('ui_avatar')) || ''
      this.accent = localStorage.getItem(storageKey('ui_accent')) || 'gold'
    },
    setAvatar(dataUrl) {
      this.avatarDataUrl = dataUrl || ''
      localStorage.setItem(storageKey('ui_avatar'), this.avatarDataUrl)
    },
    clearAvatar() {
      this.avatarDataUrl = ''
      localStorage.removeItem(storageKey('ui_avatar'))
    },
    setAccent(val) {
      this.accent = val === 'silver' ? 'silver' : 'gold'
      localStorage.setItem(storageKey('ui_accent'), this.accent)
    }
  }
})
