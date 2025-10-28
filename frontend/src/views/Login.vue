<template>
  <br><br><br>
  <div class="auth-page-wrapper">
    <div class="auth-container" :class="{ 'sign-up-mode': isSignUpMode }">
      <div class="forms-container">
        <div class="signin-signup">
          <!-- Login Form -->
          <form class="sign-in-form" @submit.prevent="handleLogin">
            <h2 class="title">Iniciar sesión</h2>
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="text" placeholder="Nombre de usuario" v-model="loginData.username" required />
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input type="password" placeholder="Contraseña" v-model="loginData.password" required />
            </div>
            
            <!-- Botón con clase .btn para las animaciones -->
            <button type="submit" class="btn solid" :disabled="loading">
              {{ loading ? 'Iniciando sesión...' : 'Entrar' }}
            </button>
            
            <p class="social-text">O inicia sesión con tus redes sociales</p>
            <div class="social-media">
              <a href="#" class="social-icon" @click.prevent="socialLogin('facebook')">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-icon" @click.prevent="socialLogin('twitter')">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="social-icon" @click.prevent="socialLogin('google')">
                <i class="fab fa-google"></i>
              </a>
              <a href="#" class="social-icon" @click.prevent="socialLogin('linkedin')">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
          </form>

          <!-- Register Form -->
          <form class="sign-up-form" @submit.prevent="handleRegister">
            <h2 class="title">Crear cuenta</h2>
            <div class="input-field">
              <i class="fas fa-user"></i>
              <input type="text" placeholder="Nombre de usuario" v-model="registerData.username" required />
            </div>
            <div class="input-field">
              <i class="fas fa-envelope"></i>
              <input type="email" placeholder="Correo electrónico" v-model="registerData.email" required />
            </div>
            <div class="input-field">
              <i class="fas fa-lock"></i>
              <input type="password" placeholder="Contraseña" v-model="registerData.password" required minlength="6" />
            </div>
            
            <!-- Botón con clase .btn para las animaciones -->
            <button type="submit" class="btn" :disabled="loading">
              {{ loading ? 'Registrando...' : 'Registrarse' }}
            </button>
            
            <p class="social-text">O regístrate con tus redes sociales</p>
            <div class="social-media">
              <a href="#" class="social-icon" @click.prevent="socialRegister('facebook')">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-icon" @click.prevent="socialRegister('twitter')">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="social-icon" @click.prevent="socialRegister('google')">
                <i class="fab fa-google"></i>
              </a>
              <a href="#" class="social-icon" @click.prevent="socialRegister('linkedin')">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
          </form>
        </div>
      </div>

      <!-- Panels -->
      <div class="panels-container">
        <div class="panel left-panel">
          <div class="content">
            <h3>¿Nuevo por aquí?</h3>
            <p>Únete a nuestra comunidad y ayuda a darles una segunda oportunidad.</p>
            <button class="btn transparent" @click="isSignUpMode = true">
              Registrarse
            </button>
          </div>
          <img src="/img/register1.svg" class="image" alt="Registro" />
        </div>

        <div class="panel right-panel">
          <div class="content">
            <h3>¿Ya tienes una cuenta?</h3>
            <p>Inicia sesión para continuar ayudando a cambiar vidas.</p>
            <button class="btn transparent" @click="isSignUpMode = false">
              Iniciar sesión
            </button>
          </div>
          <img src="/img/login.svg" class="image" alt="Login" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AuthForm',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const isSignUpMode = ref(false)
    const loading = ref(false)
    
    const API_BASE_URL = import.meta.env.VITE_API_URL
    
    const loginData = reactive({
      username: '',
      password: ''
    })
    
    const registerData = reactive({
      username: '',
      email: '',
      password: ''
    })

    const handleLogin = async () => {
      try {
        loading.value = true
        console.log('Intentando login:', loginData)
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData)
        })

        const data = await response.json()
        console.log('RESPUESTA COMPLETA DEL BACKEND:', data)

        if (data.success) {
          authStore.login(data.user, data.token)
          
          alert(data.message)
          
          // Limpiar formulario
          loginData.username = ''
          loginData.password = ''
          
          // Redirigir según el rol
          setTimeout(() => {
            if (data.user.role === 'admin') {
              console.log('Redirigiendo a ADMIN')
              router.push('/admin')
            } else {
              console.log('Redirigiendo a USERDASHBOARD')
              router.push('/userdashboard')
            }
          }, 100)
          
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error('Error en login:', error)
        alert(error.message || 'Error en el login')
      } finally {
        loading.value = false
      }
    }

    const handleRegister = async () => {
      try {
        loading.value = true
        console.log('Intentando registro:', registerData)
        
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData)
        })

        const data = await response.json()

        if (data.success) {
         
          alert('¡Registro exitoso! 🎉 ' + data.message + ' Ahora inicia sesión con tus credenciales.')
          
          // Limpiar formulario
          registerData.username = ''
          registerData.email = ''
          registerData.password = ''
          
          // Cambiar a modo login automáticamente
          isSignUpMode.value = false
          
          // NO REDIRIGIR - que el usuario inicie sesión manualmente
          console.log('Registro completado - Modo cambiado a login')
          
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error('❌ Error en registro:', error)
        alert(error.message || 'Error en el registro')
      } finally {
        loading.value = false
      }
    }
	
    const socialLogin = (provider) => {
        alert(`Login con ${provider} - Próximamente`)
      }

    const socialRegister = (provider) => {
      alert(`Registro con ${provider} - Próximamente`)
    }

    return {
      isSignUpMode,
      loading,
      loginData,
      registerData,
      handleLogin,
      handleRegister,
      socialLogin,
      socialRegister
    }
  }
}
</script>
<style scoped>
/* WRAPPER PARA GARANTIZAR ESPACIO */
.auth-page-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  background: #fff;
}

/* CONTENEDOR PRINCIPAL - RENOMBRADO para evitar conflictos */
.auth-container {
  position: relative;
  width: 100%;
  background-color: #fff;
  min-height: 100vh;
  overflow: hidden;
}

/* Asegurar que los botones se vean y tengan los estilos correctos */
.btn {
  width: 150px;
  background-color: #fa911a;
  border: none;
  outline: none;
  height: 49px;
  border-radius: 49px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.5s;
  font-size: 20px;
  /* Garantizar visibilidad */
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.btn:hover {
  background-color: #ce7918;
}

.btn.solid {
  background-color: #fa911a;
}

.btn.transparent {
  margin: 0;
  background: none;
  border: 2px solid #fff;
  width: 130px;
  height: 41px;
  font-weight: 600;
  font-size: 0.8rem;
  color: #fff;
}


.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.signin-signup {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 75%;
  width: 50%;
  transition: 1s 0.7s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
}

form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0rem 5rem;
  transition: all 0.2s 0.7s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

form.sign-up-form {
  opacity: 0;
  z-index: 1;
}

form.sign-in-form {
  z-index: 2;
}

.title {
  font-size: 2.2rem;
  color: #444;
  margin-bottom: 10px;
}

.input-field {
  max-width: 380px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 10px 0;
  height: 55px;
  border-radius: 55px;
  display: grid;
  grid-template-columns: 15% 85%;
  padding: 0 0.4rem;
  position: relative;
}

.input-field i {
  text-align: center;
  line-height: 55px;
  color: #acacac;
  transition: 0.5s;
  font-size: 1.1rem;
}

.input-field input {
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.input-field input::placeholder {
  color: #aaa;
  font-weight: 500;
}

.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
}

.social-media {
  display: flex;
  justify-content: center;
}

.social-icon {
  height: 46px;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.45rem;
  color: #333;
  border-radius: 50%;
  border: 1px solid #333;
  text-decoration: none;
  font-size: 1.1rem;
  transition: 0.3s;
}

.social-icon:hover {
  color: #ff9a24;
  border-color: #ff9a24;
}

.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.auth-container:before {
  content: "";
  position: absolute;
  height: 2000px;
  width: 2000px;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background-image: linear-gradient(-45deg, #ff9a24 0%, #ff9a24 100%);
  transition: 1.8s ease-in-out;
  border-radius: 50%;
  z-index: 6;
}

.image {
  width: 100%;
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  z-index: 6;
}

.left-panel {
  pointer-events: all;
  padding: 3rem 17% 2rem 12%;
}

.right-panel {
  pointer-events: none;
  padding: 3rem 12% 2rem 17%;
}

.panel .content {
  color: #fff;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}

.panel h3 {
  font-weight: 600;
  line-height: 1;
  font-size: 1.5rem;
}

.panel p {
  font-size: 0.95rem;
  padding: 0.7rem 0;
}

.right-panel .image,
.right-panel .content {
  transform: translateX(800px);
}

/* ANIMATION - CAMBIÉ .container POR .auth-container */
.auth-container.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

.auth-container.sign-up-mode .left-panel .image,
.auth-container.sign-up-mode .left-panel .content {
  transform: translateX(-800px);
}

.auth-container.sign-up-mode .signin-signup {
  left: 25%;
}

.auth-container.sign-up-mode form.sign-up-form {
  opacity: 1;
  z-index: 2;
}

.auth-container.sign-up-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}

.auth-container.sign-up-mode .right-panel .image,
.auth-container.sign-up-mode .right-panel .content {
  transform: translateX(0%);
}

.auth-container.sign-up-mode .left-panel {
  pointer-events: none;
}

.auth-container.sign-up-mode .right-panel {
  pointer-events: all;
}

/* RESPONSIVE - CAMBIÉ .container POR .auth-container */
@media (max-width: 870px) {
  .auth-container {
    min-height: 800px;
    height: 100vh;
  }
  .signin-signup {
    width: 100%;
    top: 95%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }

  .signin-signup,
  .auth-container.sign-up-mode .signin-signup {
    left: 50%;
  }

  .panels-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }

  .panel {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }

  .right-panel {
    grid-row: 3 / 4;
  }

  .left-panel {
    grid-row: 1 / 2;
  }

  .image {
    width: 200px;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
  }

  .panel .content {
    padding-right: 15%;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.8s;
  }

  .panel h3 {
    font-size: 1.2rem;
  }

  .panel p {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }

  .btn.transparent {
    width: 110px;
    height: 35px;
    font-size: 0.7rem;
  }

  .auth-container:before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }

  .auth-container.sign-up-mode:before {
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }

  .auth-container.sign-up-mode .left-panel .image,
  .auth-container.sign-up-mode .left-panel .content {
    transform: translateY(-300px);
  }

  .auth-container.sign-up-mode .right-panel .image,
  .auth-container.sign-up-mode .right-panel .content {
    transform: translateY(0px);
  }

  .right-panel .image,
  .right-panel .content {
    transform: translateY(300px);
  }

  .auth-container.sign-up-mode .signin-signup {
    top: 5%;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 570px) {
  form {
    padding: 0 1.5rem;
  }

  .image {
    display: none;
  }
  .panel .content {
    padding: 0.5rem 1rem;
  }
  .auth-container {
    padding: 1.5rem;
  }

  .auth-container:before {
    bottom: 72%;
    left: 50%;
  }

  .auth-container.sign-up-mode:before {
    bottom: 28%;
    left: 50%;
  }
}
</style>