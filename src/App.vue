<template>
  <v-app>
    <div class="app-root">
      <WelcomeView
        v-if="screen === 'welcome'"
        @start="screen = 'register'"
        @login="screen = 'login'"
      />

      <RegisterView
        v-else-if="screen === 'register'"
        @back="screen = 'welcome'"
        @complete="goToMain"
      />

      <LoginView
        v-else-if="screen === 'login'"
        @back="screen = 'welcome'"
        @loginSuccess="goToMain"
      />

      <v-layout v-else class="app-main">
        <Sidebar
          class="sidebar"
          :collapsed="sidebarCollapsed"
          @toggle="toggleSidebar"
          @logout="logout"
        />

        <v-main class="app-content">
          <v-container fluid class="pa-6">
            <router-view />
          </v-container>
        </v-main>
      </v-layout>
    </div>
  </v-app>
</template>

<script>
import WelcomeView from './views/authentication/WelcomeView.vue'
import RegisterView from './views/authentication/RegisterView.vue'
import LoginView from './views/authentication/LoginView.vue'
import Sidebar from './components/layout/Sidebar.vue'

export default {
  name: 'App',
  components: { WelcomeView, RegisterView, LoginView, Sidebar },
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
      this.$nextTick(() => {
        if (this.$route.path === '/') this.$router.push('/dashboard')
      })
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    logout() {
      localStorage.removeItem('current_user_email')
      localStorage.removeItem('current_user_name')
      this.sidebarCollapsed = true
      this.screen = 'welcome'
      this.$router.push('/')
    },
    goToMain() {
      this.screen = 'main'
      this.$nextTick(() => {
        if (this.$route.path !== '/dashboard') this.$router.push('/dashboard')
      })
    }
  }
}
</script>

