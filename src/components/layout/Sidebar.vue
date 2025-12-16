<template>
  <v-navigation-drawer
    :rail="collapsed"
    permanent
    width="260"
    rail-width="80"
    class="app-drawer"
  >
    <div class="d-flex align-center justify-space-between px-3 py-3">
      <div v-if="!collapsed" class="d-flex align-center ga-2">
        <i class="bi bi-stars brand-icon"></i>
        <span class="brand text-gold">Habit Flow</span>
      </div>

      <v-btn variant="text" icon @click="$emit('toggle')">
        <i :class="collapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'"></i>
      </v-btn>
    </div>

    <v-divider />

    <v-list nav density="comfortable">
      <v-list-item
        v-for="item in items"
        :key="item.name"
        :to="item.to"
        router
      >
        <template #prepend>
          <i :class="item.icon" class="nav-icon"></i>
        </template>

        <v-list-item-title v-if="!collapsed">
          {{ item.label }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <template #append>
      <div class="pa-3">
        <v-btn block variant="tonal" color="primary" @click="$emit('logout')">
          <template #prepend>
            <i class="bi bi-person-circle"></i>
          </template>
          <span v-if="!collapsed">
            {{ userName || 'User' }} · Log out
          </span>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    collapsed: { type: Boolean, required: true }
  },
  emits: ['toggle', 'logout'],
  data() {
    return {
      userName: '',
      items: [
        { name: 'dashboard', label: 'Dashboard', icon: 'bi bi-speedometer2', to: { name: 'dashboard' } },
        { name: 'habits', label: 'Habits', icon: 'bi bi-list-check', to: { name: 'habits' } },
        { name: 'tasks', label: 'Tasks', icon: 'bi bi-check2-square', to: { name: 'tasks' } },
        { name: 'analytics', label: 'Analytics', icon: 'bi bi-graph-up', to: { name: 'analytics' } },
        { name: 'settings', label: 'Settings', icon: 'bi bi-gear', to: { name: 'settings' } }
      ]
    }
  },
  created() {
    const email = localStorage.getItem('current_user_email')
    const raw = localStorage.getItem('users_db')
    if (!email || !raw) return

    try {
      const users = JSON.parse(raw)
      const user = Array.isArray(users) ? users.find(u => u.email === email) : null
      if (user?.name) this.userName = user.name
    } catch (e) {}
  }
}
</script>
