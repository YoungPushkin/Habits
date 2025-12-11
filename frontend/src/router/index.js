import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import HabitsView from '../views/HabitsView.vue'
import TasksView from '../views/TasksView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: DashboardView },
  { path: '/habits', component: HabitsView },
  { path: '/tasks', component: TasksView },
  { path: '/analytics', component: AnalyticsView },
  { path: '/settings', component: SettingsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
