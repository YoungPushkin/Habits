import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    currentUser: null
  }),
  actions: {
    load() {
      const raw = localStorage.getItem('users_db')
      if (raw) this.users = JSON.parse(raw)
    },

    save() {
      localStorage.setItem('users_db', JSON.stringify(this.users))
    },

    register(name, email, password) {
      const exists = this.users.find(u => u.email === email)
      if (exists) return false

      this.users.push({
        name,
        email,
        password,
        habits: []
      })

      this.save()
      return true
    },

    login(email, password) {
      const user = this.users.find(u => u.email === email && u.password === password)
      if (!user) return false

      this.currentUser = user
      localStorage.setItem('current_user_email', user.email)
      return true
    },

    loadCurrentUser() {
      const email = localStorage.getItem('current_user_email')
      if (!email) return
      this.currentUser = this.users.find(u => u.email === email) || null
    }
  }
})
