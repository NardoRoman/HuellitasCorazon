<template>
  <div class="login-container">
    <div class="login-background">
      <!-- Imagen de fondo con mascotas -->
      <div class="background-overlay"></div>
    </div>

    <div class="login-content">
      <!-- Logo y Header -->
      <div class="login-header">
        <router-link to="/" class="logo">
          <i class="fa-solid fa-paw"></i>
          <span>Huellitas con Corazón</span>
        </router-link>
        <h1>Bienvenido de nuevo</h1>
        <p>Ingresa a tu cuenta para continuar</p>
      </div>

      <!-- Formulario de Login -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Alertas -->
        <div v-if="error" class="alert alert-error">
          <i class="fa-solid fa-circle-exclamation"></i>
          {{ error }}
        </div>

        <div v-if="success" class="alert alert-success">
          <i class="fa-solid fa-circle-check"></i>
          {{ success }}
        </div>

        <!-- Campos del formulario -->
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <div class="input-container">
            <i class="fa-solid fa-envelope"></i>
            <input
              type="email"
              id="email"
              v-model="form.email"
              placeholder="tu@email.com"
              required
              :class="{ 'error': errors.email }"
              @input="clearError('email')"
            >
          </div>
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-container">
            <i class="fa-solid fa-lock"></i>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              placeholder="Tu contraseña"
              required
              :class="{ 'error': errors.password }"
              @input="clearError('password')"
            >
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </button>
          </div>
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>

        <!-- Opciones adicionales -->
        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.rememberMe">
            <span class="checkmark"></span>
            Recordar mi sesión
          </label>
          <router-link to="/forgot-password" class="forgot-password">
            ¿Olvidaste tu contraseña?
          </router-link>
        </div>

        <!-- Botón de login -->
        <button
          type="submit"
          class="login-btn"
          :disabled="loading"
        >
          <i class="fa-solid" :class="loading ? 'fa-spinner fa-spin' : 'fa-right-to-bracket'"></i>
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>

        <!-- Separador -->
        <div class="separator">
          <span>o continuar con</span>
        </div>

        <!-- Login social -->
        <div class="social-login">
          <button type="button" class="social-btn google-btn" @click="socialLogin('google')">
            <i class="fa-brands fa-google"></i>
            Google
          </button>
          <button type="button" class="social-btn facebook-btn" @click="socialLogin('facebook')">
            <i class="fa-brands fa-facebook-f"></i>
            Facebook
          </button>
        </div>
      </form>

      <!-- Enlaces adicionales -->
      <div class="login-footer">
        <p>
          ¿No tienes una cuenta?
          <router-link to="/register" class="register-link">Regístrate aquí</router-link>
        </p>
        <router-link to="/" class="back-home">
          <i class="fa-solid fa-arrow-left"></i>
          Volver al inicio
        </router-link>
      </div>
    </div>

    <!-- Demo Users Modal -->
    <div v-if="showDemoUsers" class="demo-modal" @click="showDemoUsers = false">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="showDemoUsers = false">×</button>
        <h3>Usuarios de Demo</h3>
        <p>Selecciona un usuario para probar el login:</p>
        
        <div class="demo-users">
          <div 
            v-for="user in demoUsers" 
            :key="user.id"
            class="demo-user-card"
            @click="fillDemoUser(user)"
          >
            <div class="user-avatar">
              <i :class="user.icon"></i>
            </div>
            <div class="user-info">
              <h4>{{ user.name }}</h4>
              <p>{{ user.email }}</p>
              <small>{{ user.role }}</small>
            </div>
            <i class="fa-solid fa-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const error = ref('')
    const success = ref('')
    const showPassword = ref(false)
    const showDemoUsers = ref(false)

    const form = reactive({
      email: '',
      password: '',
      rememberMe: false
    })

    const errors = reactive({
      email: '',
      password: ''
    })

    // Usuarios de demo para testing
    const demoUsers = ref([
      {
        id: 1,
        name: 'Ana García',
        email: 'ana@huellitas.com',
        password: 'password123',
        role: 'Adoptante',
        icon: 'fa-solid fa-user'
      },
      {
        id: 2,
        name: 'Carlos Méndez',
        email: 'carlos@huellitas.com',
        password: 'password123',
        role: 'Veterinario',
        icon: 'fa-solid fa-user-doctor'
      },
      {
        id: 3,
        name: 'Laura Fernández',
        email: 'laura@huellitas.com',
        password: 'password123',
        role: 'Coordinadora',
        icon: 'fa-solid fa-user-tie'
      },
      {
        id: 4,
        name: 'Admin',
        email: 'admin@huellitas.com',
        password: 'admin123',
        role: 'Administrador',
        icon: 'fa-solid fa-user-shield'
      }
    ])

    const validateForm = () => {
      let isValid = true
      
      // Reset errors
      Object.keys(errors).forEach(key => errors[key] = '')
      
      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.email) {
        errors.email = 'El correo electrónico es requerido'
        isValid = false
      } else if (!emailRegex.test(form.email)) {
        errors.email = 'Ingresa un correo electrónico válido'
        isValid = false
      }
      
      // Validar contraseña
      if (!form.password) {
        errors.password = 'La contraseña es requerida'
        isValid = false
      } else if (form.password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres'
        isValid = false
      }
      
      return isValid
    }

    const handleLogin = async () => {
      if (!validateForm()) return
      
      loading.value = true
      error.value = ''
      success.value = ''

      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Buscar usuario en demo users
        const user = demoUsers.value.find(u => 
          u.email === form.email && u.password === form.password
        )
        
        if (user) {
          // Login exitoso
          success.value = '¡Inicio de sesión exitoso!'
          
          // Guardar en localStorage si rememberMe está activado
          if (form.rememberMe) {
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('token', 'demo-token-' + user.id)
          } else {
            sessionStorage.setItem('user', JSON.stringify(user))
            sessionStorage.setItem('token', 'demo-token-' + user.id)
          }
          
          // Redirigir después de un breve delay
          setTimeout(() => {
            router.push('/dashboard')
          }, 1000)
          
        } else {
          error.value = 'Credenciales incorrectas. Por favor verifica tu email y contraseña.'
        }
        
      } catch (err) {
        error.value = 'Error al iniciar sesión. Por favor intenta nuevamente.'
        console.error('Login error:', err)
      } finally {
        loading.value = false
      }
    }

    const socialLogin = (provider) => {
      // En una app real, aquí iría la integración con OAuth
      alert(`Inicio de sesión con ${provider} en desarrollo`)
    }

    const clearError = (field) => {
      errors[field] = ''
      error.value = ''
    }

    const fillDemoUser = (user) => {
      form.email = user.email
      form.password = user.password
      showDemoUsers.value = false
    }

    const checkExistingSession = () => {
      const user = localStorage.getItem('user') || sessionStorage.getItem('user')
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      
      if (user && token) {
        // Usuario ya está logueado, redirigir al dashboard
        router.push('/dashboard')
      }
    }

    onMounted(() => {
      checkExistingSession()
      
      // Mostrar modal de demo users después de 2 segundos (solo en desarrollo)
      setTimeout(() => {
        showDemoUsers.value = true
      }, 2000)
    })

    return {
      form,
      errors,
      loading,
      error,
      success,
      showPassword,
      showDemoUsers,
      demoUsers,
      handleLogin,
      socialLogin,
      clearError,
      fillDemoUser
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #ff9a24 0%, #ff6b6b 100%);
  padding: 20px;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/img/login-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 154, 36, 0.1);
  backdrop-filter: blur(5px);
}

.login-content {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 50px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  z-index: 2;
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 800;
  color: #131313;
  text-decoration: none;
  margin-bottom: 30px;
}

.logo i {
  color: #ff9a24;
}

.login-header h1 {
  font-size: 32px;
  font-weight: 800;
  color: #131313;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 16px;
}

/* Formulario */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Alertas */
.alert {
  padding: 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.alert-error {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.alert-success {
  background: #e8f5e8;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

/* Campos del formulario */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #131313;
  font-size: 14px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-container i {
  position: absolute;
  left: 15px;
  color: #666;
  z-index: 2;
}

.input-container input {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
}

.input-container input:focus {
  outline: none;
  border-color: #ff9a24;
  box-shadow: 0 0 0 3px rgba(255, 154, 36, 0.1);
}

.input-container input.error {
  border-color: #f44336;
}

.password-toggle {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px;
}

.error-text {
  color: #f44336;
  font-size: 12px;
  font-weight: 600;
}

/* Opciones del formulario */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: #ff9a24;
  border-color: #ff9a24;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark:after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 12px;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.forgot-password {
  color: #ff9a24;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* Botón de login */
.login-btn {
  background: #131313;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.login-btn:hover:not(:disabled) {
  background: #ff9a24;
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Separador */
.separator {
  position: relative;
  text-align: center;
  margin: 20px 0;
}

.separator:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e0e0e0;
}

.separator span {
  background: white;
  padding: 0 15px;
  color: #666;
  font-size: 14px;
}

/* Login social */
.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.social-btn {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.google-btn:hover {
  border-color: #db4437;
  color: #db4437;
}

.facebook-btn:hover {
  border-color: #4267B2;
  color: #4267B2;
}

/* Footer */
.login-footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.login-footer p {
  color: #666;
  margin-bottom: 15px;
}

.register-link {
  color: #ff9a24;
  text-decoration: none;
  font-weight: 600;
}

.register-link:hover {
  text-decoration: underline;
}

.back-home {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: color 0.3s ease;
}

.back-home:hover {
  color: #131313;
}

/* Modal de Demo Users */
.demo-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-content h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #131313;
}

.modal-content p {
  color: #666;
  margin-bottom: 20px;
}

.demo-users {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-user-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.demo-user-card:hover {
  border-color: #ff9a24;
  transform: translateX(5px);
}

.user-avatar {
  width: 50px;
  height: 50px;
  background: #ff9a24;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.user-info {
  flex: 1;
}

.user-info h4 {
  font-weight: 600;
  color: #131313;
  margin-bottom: 2px;
}

.user-info p {
  color: #666;
  font-size: 14px;
  margin-bottom: 2px;
}

.user-info small {
  color: #ff9a24;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
}

.demo-user-card .fa-chevron-right {
  color: #666;
}

/* Responsive */
@media screen and (max-width: 480px) {
  .login-content {
    padding: 30px 20px;
  }
  
  .social-login {
    grid-template-columns: 1fr;
  }
  
  .form-options {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>