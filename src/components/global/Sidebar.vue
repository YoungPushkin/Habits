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
        <span :class="['brand', { 'brand-hidden': collapsed }]">Habit Flow</span>
      </div>

      <BaseButton kind="icon" icon variant="text" class="toggle-btn" @click="$emit('toggle')">
        <i :class="collapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'"></i>
      </BaseButton>
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

        <BaseButton
          v-if="!collapsed"
          kind="icon"
          icon
          color="primary"
          class="logout-btn"
          @click="$emit('logout')"
          title="Log out"
        >
          <i class="bi bi-box-arrow-right"></i>
        </BaseButton>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { useUsersStore } from '../../stores/users'
import { useUiStore } from '../../stores/settings'
import BaseButton from './BaseButton.vue'
import { deriveUserName, deriveInitials } from '../../utils/auth.js'

export default {
  name: 'Sidebar',
  components: { BaseButton },

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
      return deriveUserName(this.usersStore.currentUser)
    },
    avatarUrl() {
      return this.ui.avatarDataUrl || ''
    },
    initials() {
      return deriveInitials(this.userName)
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
  width: 30px;
  color: var(--gold);
  padding-left: 10px;
}
.brand{
  font-family:var(--font-accent);
  letter-spacing:.16em;
  text-transform:uppercase;
  font-size:20px;
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
  position:relative;
  height:64px;
  width:100%;
  padding:0 16px;
}
.sidebar-brand{
  position:absolute;
  inset-inline-start:24px;
  top:50%;
  transform:translateY(-50%);
}
.toggle-btn{
  position:absolute;
  inset-inline-end:15px;
  top:50%;
  transform:translateY(-50%);
  min-width:44px;
  width:44px;
  height:44px;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:0;
}
.nav-collapsed .toggle-btn{
  margin:0;
}
.brand-hidden{
  opacity:0;
  visibility:hidden;
  pointer-events:none;
}

.app-drawer{
  position:fixed !important;
  top:0;
  left:0;
  height:100vh !important;
  max-height:100vh !important;
  overflow:hidden;
}
.app-drawer :deep(.v-navigation-drawer__content){
  height:100%;
  max-height:100%;
  overflow-y:auto;
  overflow-x:hidden;
}
</style>
