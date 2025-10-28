import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Catalog from '../views/Catalog.vue'
import About from '../views/About.vue'
import EventPage from '../views/Event.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'
import UserDashboard from '../views/UserDashboard.vue'  
import Admin from '../views/Admin.vue'
import AdoptionProcess from '../views/AdoptionProcess.vue'

// Importar guards
import { authGuard, adminGuard, userGuard } from './guards'
import Profile from '../views/Profile.vue'

const routes = [
  { 
    path: '/HuellitasCorazon/', 
    redirect: '/'
  },
  { 
    path: '/', 
    component: Home 
  },
  { 
    path: '/catalog', 
    component: Catalog 
  },
  { 
    path: '/about', 
    component: About 
  },
  { 
    path: '/event', 
    component: EventPage 
  },
  { 
    path: '/contact', 
    component: Contact 
  },
  { 
    path: '/login', 
    component: Login 
  },
  { 
    path: '/userdashboard', 
    component: UserDashboard,
    beforeEnter: userGuard // Solo usuarios normales
  },
  { 
    path: '/admin', 
    component: Admin,
    beforeEnter: adminGuard // Solo administradores
  },
  { 
    path: '/adoption/:petId?', 
    component: AdoptionProcess,
    beforeEnter: authGuard // Cualquier usuario autenticado
  },
  { 
    path: '/profile', 
    component: Profile,
    beforeEnter: userGuard // Solo usuarios normales
  },
]

const router = createRouter({
  history: createWebHistory('/HuellitasCorazon/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  }
})

export default router
