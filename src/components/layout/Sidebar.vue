<template>
  <v-navigation-drawer
    :rail="collapsed"
    permanent
    width="260"
    rail-width="80"
    :class="['app-drawer', { 'nav-collapsed': collapsed }]"
  >
    <div class="sidebar-head">
      <div class="sidebar-brand">
        <span v-if="!collapsed" class="brand text-gold">Habit Flow</span>
      </div>

      <v-btn variant="text" icon class="toggle-btn" @click="$emit('toggle')">
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
        class="nav-item"
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
      <div class="pa-3 user-block" :class="{ 'is-collapsed': collapsed }">
        <div class="user-info">
          <v-avatar size="32" color="primary" variant="tonal">
            <v-img v-if="avatarUrl" :src="avatarUrl" cover />
            <span v-else class="text-uppercase avatar-text">
              {{ initials }}
            </span>
          </v-avatar>
          <div v-if="!collapsed" class="user-name">
            {{ userName || 'User' }}
          </div>
        </div>

        <v-btn
          v-if="!collapsed"
          icon
          variant="tonal"
          color="primary"
          class="logout-btn"
          @click="$emit('logout')"
          title="Log out"
        >
          <i class="bi bi-box-arrow-right"></i>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { useUsersStore } from '../../stores/users'
import { useUiStore } from '../../stores/settings'

export default {
  name: 'Sidebar',

  props: {
    collapsed: { type: Boolean, required: true }
  },

  emits: ['toggle', 'logout'],

  data() {
    return {
      usersStore: useUsersStore(),
      ui: useUiStore(),
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
    this.usersStore.load()
    this.usersStore.loadCurrentUser()
  },

  computed: {
    userName() {
      return this.usersStore.currentUser?.name || 'User'
    },
    avatarUrl() {
      return this.ui.avatarDataUrl || ''
    },
    initials() {
      const n = String(this.userName || 'U').trim()
      return n.slice(0, 2).toUpperCase()
    },

    sidebarClass() {
      return {
        'sidebar--collapsed': this.collapsed
      }
    }
  },

  methods: {
    onLogout() {
      this.$emit('logout')
    }
  }
}
</script>

<style scoped>
.nav-collapsed .nav-item :deep(.v-list-item__prepend) {
  justify-content: center;
  margin-inline-end: 0;
}
.nav-collapsed .nav-item :deep(.v-list-item__content) {
  display: none;
}
.nav-icon {
  font-size: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
}
.user-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.user-block.is-collapsed {
  flex-direction: column;
  align-items: center;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-name {
  font-weight: 600;
  font-size: 14px;
}
.avatar-text {
  font-weight: 600;
  font-size: 12px;
}
.logout-btn {
  min-width: 36px;
}
.sidebar-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px;
  min-height:56px;
  width:100%;
}
.sidebar-brand{
  display:flex;
  align-items:center;
  padding-inline-start:16px;
}
.nav-collapsed .sidebar-head{
  justify-content:center;
  padding:12px;
}
.toggle-btn{
  min-width:36px;
  height:36px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin-left:-8px;
}
.nav-collapsed .toggle-btn{
  margin:0;
  margin-left:0;
}
</style>
