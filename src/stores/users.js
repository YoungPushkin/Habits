import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  // STATE: local user list + current session
  state: () => ({
    users: [],
    currentUser: null
  }),

  // ACTIONS: storage + auth flow
  actions: {
    load() {
      const raw = localStorage.getItem('users_db')
      this.users = raw ? JSON.parse(raw) : []
    },

    save() {
      localStorage.setItem('users_db', JSON.stringify(this.users))
    },

    register(name, email, password) {
      const n = name.trim()
      const e = email.trim().toLowerCase()
      const p = password.trim()

      if (!n || !e || !p) {
        return { ok: false, error: 'Invalid data' }
      }

      if (this.users.some(u => u.email === e)) {
        return { ok: false, error: 'User already exists' }
      }

      this.users.push({ name: n, email: e, password: p })
      this.save()

      this.currentUser = { name: n, email: e }
      localStorage.setItem('current_user_email', e)

      return { ok: true }
    },

    login(email, password) {
      const e = email.trim().toLowerCase()
      const p = password.trim()

      const user = this.users.find(u => u.email === e && u.password === p)
      if (!user) {
        return { ok: false, error: 'Wrong email or password' }
      }

      this.currentUser = { name: user.name, email: user.email }
      localStorage.setItem('current_user_email', user.email)

      return { ok: true }
    },

    loadCurrentUser() {
      const email = localStorage.getItem('current_user_email')
      if (!email) {
        this.currentUser = null
        return
      }

      const user = this.users.find(u => u.email === email)
      this.currentUser = user ? { name: user.name, email: user.email } : null
    },

    changePassword(newPassword) {
      const p = String(newPassword || '').trim()
      if (!p) return { ok: false, error: 'Password is required' }
      if (!this.currentUser?.email) return { ok: false, error: 'Not logged in' }

      const idx = this.users.findIndex(u => u.email === this.currentUser.email)
      if (idx === -1) return { ok: false, error: 'User not found' }

      this.users[idx] = { ...this.users[idx], password: p }
      this.save()
      return { ok: true }
    },

    logout() {
      this.currentUser = null
      localStorage.removeItem('current_user_email')
    }
  }
})
