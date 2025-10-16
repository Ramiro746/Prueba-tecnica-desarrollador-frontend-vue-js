import { createRouter, createWebHistory } from 'vue-router'
import proyectosView from '@/views/ProyectosView.vue'
import TareasView from '@/views/TareasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'proyectosView',
      component: proyectosView,
    },
    {
      path: '/tareas',
      name: 'tareasView',
      component: TareasView,
    }
  ],
})

export default router
