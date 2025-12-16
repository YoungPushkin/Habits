import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import HabitsView from '../views/HabitsView.vue'
import TasksView from '../views/TasksView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  {
    path: '/',
    redirect: { name: 'dashboard' }
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
  if (!to.meta.requiresAuth) return true

  const isLoggedIn = !!localStorage.getItem('current_user_email')
  if (!isLoggedIn) {
    return { path: '/' }
  }

  return true
})

export default router
