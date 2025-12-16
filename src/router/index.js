import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/authentication/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import HabitsView from '../views/HabitsView.vue'
import TasksView from '../views/TasksView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  {
    path: '/',
    redirect: () => {
      const isLoggedIn = !!localStorage.getItem('current_user_email')
      return isLoggedIn ? { name: 'dashboard' } : { name: 'login' }
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/habits',
    name: 'habits',
    component: HabitsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TasksView,
    meta: { requiresAuth: true }
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: AnalyticsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const isLoggedIn = !!localStorage.getItem('current_user_email')

  if (to.name === 'login' && isLoggedIn) return { name: 'dashboard' }
  if (to.meta.requiresAuth && !isLoggedIn) return { name: 'login' }

  return true
})

export default router
