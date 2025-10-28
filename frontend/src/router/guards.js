import { useAuthStore } from '@/stores/auth'

export const authGuard = (to, from, next) => {
  console.log('authGuard ejecutándose para:', to.path)
  const authStore = useAuthStore()
  
  if (authStore.isLoading) {
    console.log('authGuard: Aún cargando, permitiendo navegación')
    next()
    return
  }
  
  if (!authStore.isAuthenticated) {
    console.log('authGuard: No autenticado, redirigiendo a login')
    next('/login')
  } else {
    console.log('authGuard: Autenticado, permitiendo acceso')
    next()
  }
}

export const adminGuard = (to, from, next) => {
  console.log('adminGuard ejecutándose para:', to.path)
  const authStore = useAuthStore()
  
  console.log('adminGuard - Store state:', {
    isLoading: authStore.isLoading,
    isAuthenticated: authStore.isAuthenticated,
    isAdmin: authStore.isAdmin,
    user: authStore.user
  })
  
  if (authStore.isLoading) {
    console.log('adminGuard: Aún cargando, permitiendo navegación')
    next()
    return
  }
  
  if (!authStore.isAuthenticated) {
    console.log('adminGuard: No autenticado, redirigiendo a login')
    next('/login')
  } else if (!authStore.isAdmin) {
    console.log('adminGuard: No es admin, redirigiendo a userdashboard')
    console.log('Rol actual:', authStore.user?.role)
    next('/userdashboard')
  } else {
    console.log('adminGuard: Es admin, permitiendo acceso a admin panel')
    next()
  }
}

export const userGuard = (to, from, next) => {
  console.log('userGuard ejecutándose para:', to.path)
  const authStore = useAuthStore()
  
  console.log('userGuard - Store state:', {
    isLoading: authStore.isLoading,
    isAuthenticated: authStore.isAuthenticated,
    isUser: authStore.isUser,
    user: authStore.user
  })
  
  if (authStore.isLoading) {
    console.log('userGuard: Aún cargando, permitiendo navegación')
    next()
    return
  }
  
  if (!authStore.isAuthenticated) {
    console.log('userGuard: No autenticado, redirigiendo a login')
    next('/login')
  } else if (!authStore.isUser) {
    console.log('userGuard: No es user, redirigiendo a admin')
    console.log('Rol actual:', authStore.user?.role)
    next('/admin')
  } else {
    console.log('userGuard: Es user, permitiendo acceso a user dashboard')
    next()
  }
}