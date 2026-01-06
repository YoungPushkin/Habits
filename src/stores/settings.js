import { defineStore } from 'pinia'

import { storageKey } from '../utils/storageKey.js'

export const useUiStore = defineStore('ui', {
  state: () => ({
    avatarDataUrl: '',
    accent: 'gold',
    toastMessage: '',
    toastColor: 'success',
    toastVisible: false
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
    },
    showToast(message, color = 'success') {
      this.toastMessage = message || ''
      this.toastColor = color || 'success'
      this.toastVisible = !!this.toastMessage
    },
    hideToast() {
      this.toastVisible = false
      this.toastMessage = ''
    },
    resetAll() {
      this.clearAvatar()
      this.setAccent('gold')
      this.hideToast()
    }
  }
})
