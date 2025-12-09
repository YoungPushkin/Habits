<template>
  <div class="app-root">
    <WelcomeView
      v-if="screen === 'welcome'"
      @start="screen = 'register'"
    />

    <RegisterView
      v-if="screen === 'register'"
      @back="screen = 'welcome'"
      @complete="screen = 'main'"
    />

    <div v-if="screen === 'main'" class="app-main">
      <Sidebar
        :collapsed="sidebarCollapsed"
        @toggle="toggleSidebar"
        @logout="logout"
      />

      <DashboardView />
    </div>
  </div>
</template>

<script>
import WelcomeView from './views/WelcomeView.vue'
import RegisterView from './views/RegisterView.vue'
import Sidebar from './components/layout/Sidebar.vue'
import DashboardView from './views/DashboardView.vue'

export default {
  name: 'App',
  components: {
    WelcomeView,
    RegisterView,
    Sidebar,
    DashboardView
  },
  data() {
    return {
      screen: 'welcome',
      sidebarCollapsed: true
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    logout() {
      this.screen = 'welcome'
      this.sidebarCollapsed = true
    }
  }
}
</script>
