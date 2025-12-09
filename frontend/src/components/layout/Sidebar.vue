<template>
  <aside class="sidebar" :class="{ collapsed: collapsed }">
    <div class="top">
      <div class="brand" v-if="!collapsed">
        <i class="bi bi-stars icon"></i>
        <span class="brand-text">Habit Flow</span>
      </div>

      <button type="button" class="toggle" @click="$emit('toggle')">
        <i v-if="collapsed" class="bi bi-chevron-right"></i>
        <i v-else class="bi bi-chevron-left"></i>
      </button>
    </div>

    <nav class="nav">
      <button
        v-for="item in items"
        :key="item.name"
        type="button"
        class="item"
      >
        <i :class="[item.icon, 'icon']"></i>
        <span v-if="!collapsed" class="label">{{ item.label }}</span>
      </button>
    </nav>

    <div class="bottom">
      <button type="button" class="user">
        <i class="bi bi-person-circle icon"></i>
        <div v-if="!collapsed" class="user-info">
          <span class="name">User</span>
          <span class="logout">Log out</span>
        </div>
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    collapsed: Boolean
  },
  emits: ['toggle'],
  data() {
    return {
      items: [
        { name: 'dashboard', label: 'Dashboard', icon: 'bi bi-speedometer2' },
        { name: 'habits', label: 'Habits', icon: 'bi bi-list-check' },
        { name: 'tasks', label: 'Tasks', icon: 'bi bi-check2-square' },
        { name: 'analytics', label: 'Analytics', icon: 'bi bi-graph-up' },
        { name: 'settings', label: 'Settings', icon: 'bi bi-gear' }
      ]
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: #050505;
  border-right: 1px solid rgba(212, 175, 55, 0.25);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  transition: width 0.2s ease;
}

.sidebar.collapsed {
  width: 80px;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.sidebar.collapsed .toggle {
  margin-left: 10px;
}

.icon {
  font-size: 20px;
  color: #d4af37;
}
.bi-person-circle.icon {
  font-size: 25px;
}

.brand-text {
  font-family: "Playfair Display", serif;
  font-size: 18px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.toggle {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid rgba(212, 175, 55, 0.6);
  background: transparent;
  color: #d4af37;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  border: none;
  background: transparent;
  color: #e5e5e5;
  padding: 10px 12px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 18px;
}

.item:hover {
  background: rgba(212, 175, 55, 0.12);
}

.label {
  white-space: nowrap;
}

.bottom {
  margin-top: 16px;
}

.user {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 999px;
  border: none;
  background: rgba(212, 175, 55, 0.06);
  padding: 8px 10px;
  color: #f5f5f5;
  cursor: pointer;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 16px;
  margin-left: 50px;
}

.logout {
  font-size: 16px;
  color: #c0c0c0;
  margin-left: 50px;
}
</style>
