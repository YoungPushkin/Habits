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
      />

      <main class="app-main-content">
        <h2>Dashboard coming soon</h2>
        <p>Here we will build your daily overview: habits, tasks and analytics.</p>
      </main>
    </div>
  </div>
</template>

<script>
import WelcomeView from './views/WelcomeView.vue'
import RegisterView from './views/RegisterView.vue'
import Sidebar from './components/layout/Sidebar.vue'

export default {
  name: 'App',
  components: {
    WelcomeView,
    RegisterView,
    Sidebar
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
    }
  }
}
</script>
