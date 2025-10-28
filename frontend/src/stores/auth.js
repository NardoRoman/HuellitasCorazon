import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user_data')) || null)
  const token = ref(localStorage.getItem('auth_token') || null)
  const isLoading = ref(true)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isUser = computed(() => user.value?.role === 'user')

  const login = (user_data, auth_token) => {
    user.value = user_data
    token.value = auth_token
    localStorage.setItem('user_data', JSON.stringify(user_data))
    localStorage.setItem('auth_token', auth_token)
    isLoading.value = false 
    
    console.log('Store - Login exitoso:', {
      user: user.value,
      token: token.value,
      isAuthenticated: isAuthenticated.value
    })
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('user_data')
    localStorage.removeItem('auth_token')
    isLoading.value = false
    
    console.log('Store - Logout realizado')
  }

  const updateUser = (user_data) => {
    user.value = user_data
    localStorage.setItem('user_data', JSON.stringify(user_data))
    
    console.log('Store - Usuario actualizado:', user_data)
  }

  const initialize = () => {
    const savedUser = localStorage.getItem('user_data')
    const savedToken = localStorage.getItem('auth_token')
    
    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
      console.log('Store - Inicializado con datos existentes:', user.value)
    } else {
      console.log('Store - No hay datos de autenticación guardados')
    }
    isLoading.value = false
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    isUser,
    login,
    logout,
    updateUser,
    initialize
  }
})