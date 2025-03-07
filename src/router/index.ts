import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuth } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/assignments',
      name: 'assignments',
      component: () => import('../views/AssignmentsView.vue'),
    },
    {
      path: '/simple',
      name: 'simple',
      component: () => import('../views/SimpleAssignmentView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/selectMode',
      name: 'selectMode',
      component: () => import('../views/SelectModeView.vue'),
    },
  ],
})
router.beforeEach((to) => {
  if (useAuth().currentMode.value === '' && to.name !== 'selectMode') {
    return { name: 'selectMode' }
  }
  if (
    useAuth().currentMode.value === 'assignments' &&
    to.name !== 'simple' &&
    to.name !== 'selectMode'
  ) {
    // redirect the user to the login page
    return { name: 'simple' }
  }
  return true
})

export default router
