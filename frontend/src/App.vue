<template>
  <div class="app-root">
    <WelcomeView
      v-if="screen === 'welcome'"
      @start="screen = 'register'"
      @login="screen = 'login'"
    />

    <RegisterView
      v-if="screen === 'register'"
      @back="screen = 'welcome'"
      @complete="goToMain"
    />

    <LoginView
      v-if="screen === 'login'"
      @back="screen = 'welcome'"
      @loginSuccess="goToMain"
    />

    <div v-if="screen === 'main'" class="app-main">
      <Sidebar
        :collapsed="sidebarCollapsed"
        @toggle="toggleSidebar"
        @logout="logout"
      />
      <router-view />
    </div>
  </div>
</template>

<script>
import WelcomeView from './views/WelcomeView.vue'
import RegisterView from './views/RegisterView.vue'
import LoginView from './views/LoginView.vue'
import Sidebar from './components/layout/Sidebar.vue'

export default {
  name: 'App',
  components: {
    WelcomeView,
    RegisterView,
    LoginView,
    Sidebar
  },
  data() {
    return {
      screen: 'welcome',
      sidebarCollapsed: true
    }
  },
  created() {
    const email = localStorage.getItem('current_user_email')
    if (email) {
      this.screen = 'main'
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    logout() {
      localStorage.removeItem('current_user_email')
      this.sidebarCollapsed = true
      this.screen = 'welcome'
    },
    goToMain() {
      this.screen = 'main'
    }
  }
}
</script>
