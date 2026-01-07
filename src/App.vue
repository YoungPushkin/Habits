<template>
  <v-app :data-accent="ui.accent">
    <div>
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

      <v-snackbar
        v-model="ui.toastVisible"
        :color="ui.toastColor"
        location="bottom right"
        timeout="2500"
      >
        {{ ui.toastMessage }}
        <template #actions>
          <v-btn icon size="small" variant="text" @click="ui.hideToast()">
            <v-icon icon="mdi-close" />
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
import WelcomeView from './views/authentication/WelcomeView.vue'
import RegisterView from './views/authentication/RegisterView.vue'
import LoginView from './views/authentication/LoginView.vue'
import Sidebar from './components/global/Sidebar.vue'

import { useUiStore } from './stores/settings'
import { useUsersStore } from './stores/users'
import { useHabitsStore } from './stores/habits'
import { useTasksStore } from './stores/tasks'
import { initAllStores } from './utils/bootstrap.js'
import DayWatcherMixin from './mixins/DayWatcher.mixin'

export default {
  name: 'App',
  mixins: [DayWatcherMixin],
  components: { WelcomeView, RegisterView, LoginView, Sidebar },
  data() {
    return {
      ui: useUiStore(),
      usersStore: useUsersStore(),
      habitsStore: useHabitsStore(),
      tasksStore: useTasksStore(),

      screen: 'welcome',
      sidebarCollapsed: true
    }
  },
  created() {
    initAllStores()

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
      // clear in-memory state; keep per-user data persisted
      this.habitsStore.$reset?.()
      this.tasksStore.$reset?.()
      this.ui.$reset?.()
      this.usersStore.logout?.()
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
