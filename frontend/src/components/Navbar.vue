<template>
  <nav>
    <router-link to="/" class="brand">
      <h1>H<b class="accent">C</b></h1>
    </router-link>

    <div :class="['menu', { active: menuOpen }]">
      <div class="btn">
        <i class="fas fa-times close-btn" @click="closeMenu"></i>
      </div>

      <router-link to="/" @click="closeMenu">Inicio</router-link>
      <router-link to="/about" @click="closeMenu">Sobre nosotros</router-link>
      <router-link to="/catalog" @click="closeMenu">Catálogo</router-link>
      <router-link to="/event" @click="closeMenu">Eventos</router-link>
      <router-link to="/contact" @click="closeMenu">Contacto</router-link>
      
      <!-- Estado para usuario no logueado (mobile) -->
      <router-link v-if="!authStore.user" to="/login" class="login-mobile-only" @click="closeMenu">
        <i class="fas fa-user"></i>
        Iniciar sesión
      </router-link>
      
      <!-- Estado para usuario logueado (mobile) -->
      <div v-else class="user-menu-mobile">
        <div class="user-info">
          <i class="fas fa-user-circle"></i>
          <span>{{ authStore.user.username }}</span>
          <span class="user-role-badge" :class="authStore.user.role">
            {{ authStore.user.role === 'admin' ? 'Admin' : 'User' }}
          </span>
        </div>
        <button @click="handleLogout" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          Cerrar sesión
        </button>
      </div>
    </div>

    <!-- Estado para usuario no logueado (desktop) -->
    <button v-if="!authStore.user" class="btn-2" @click="$router.push('/login')">
      <p>Iniciar sesión</p>
      <i class="fas fa-user"></i>
    </button>

    <!-- Estado para usuario logueado (desktop) -->
    <div v-else class="user-menu-desktop">
      <div class="user-dropdown">
        <button class="user-btn" @click="toggleUserMenu">
          <i class="fas fa-user-circle"></i>
          <span>{{ authStore.user.username }}</span>
          <span class="user-role-badge" :class="authStore.user.role">
            {{ authStore.user.role === 'admin' ? '' : '' }}
          </span>
          <i class="fas fa-chevron-down"></i>
        </button>
        
        <div v-if="userMenuOpen" class="dropdown-menu">
          <div class="user-info-dropdown">
            <strong>{{ authStore.user.username }}</strong>
            <span class="user-role" :class="authStore.user.role">
              {{ authStore.user.role === 'admin' ? 'Administrador' : 'Usuario' }}
            </span>
          </div>
          
          <div class="dropdown-divider"></div>
          
          <router-link v-if="authStore.isAdmin" to="/admin" class="dropdown-item" @click="closeUserMenu">
            <i class="fas fa-cog"></i>
            Panel Admin
          </router-link>
          
          <router-link v-if="authStore.isUser" to="/userdashboard" class="dropdown-item" @click="closeUserMenu">
            <i class="fas fa-tachometer-alt"></i>
            Mi Dashboard
          </router-link>
          
          <router-link v-if="authStore.user.role !== 'admin'" to="/profile" class="dropdown-item" @click="closeUserMenu">
            <i class="fas fa-user"></i>
            Mi Perfil
          </router-link>

          <div class="dropdown-divider"></div>
          
          <button @click="handleLogout" class="dropdown-item logout">
            <i class="fas fa-sign-out-alt"></i>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>

    <div class="btn">
      <i class="fas fa-bars menu-btn" @click="toggleMenu"></i>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const menuOpen = ref(false)
const userMenuOpen = ref(false)

// Inicializar el store al montar el componente
onMounted(() => {
  authStore.initialize()
})

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    userMenuOpen.value = false
  }
}

const closeMenu = () => {
  menuOpen.value = false
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
  if (userMenuOpen.value) {
    menuOpen.value = false
  }
}

const closeUserMenu = () => {
  userMenuOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  userMenuOpen.value = false
  menuOpen.value = false
  router.push('/')
}
</script>

<style scoped>
/* Ocultar el enlace de login en el menú cuando está en vista desktop */
.menu .login-mobile-only,
.menu .user-menu-mobile {
  display: none;
}

/* Mostrar solo cuando el menú hamburguesa está activo (en móvil) */
.menu.active .login-mobile-only,
.menu.active .user-menu-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #eee;
  margin-top: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #333;
}

.user-info i {
  font-size: 1.2rem;
  color: #4a6cf7;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #dc3545;
  color: white;
}

/* Estilos para el menú de usuario en desktop */
.user-menu-desktop {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-btn:hover {
  background: #e9ecef;
}

.user-btn i:first-child {
  color: #4a6cf7;
  font-size: 1.2rem;
}

.user-btn i:last-child {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.user-btn:hover i:last-child {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #333;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.3s ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.dropdown-item.logout {
  color: #dc3545;
}

.dropdown-item.logout:hover {
  background: #dc3545;
  color: white;
}

.dropdown-divider {
  height: 1px;
  background: #dee2e6;
  margin: 0.25rem 0;
}

.user-role-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.user-role-badge.admin {
  background: #ffd700;
  color: #000;
}

.user-role-badge.user {
  background: #4a6cf7;
  color: white;
}

.user-info-dropdown {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
}

.user-role {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

.user-role.admin {
  color: #d4af37;
  font-weight: 600;
}

.user-role.user {
  color: #4a6cf7;
}

</style>