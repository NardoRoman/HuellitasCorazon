<template>
    <br><br><br><br><br>
  <div class="profile-page">
    <!-- Header del Perfil -->
    <div class="profile-header">
      <div class="header-content">
        <h1>Completar Mi Perfil</h1>
        <p>Ayúdanos a conocerte mejor para mejorar tu experiencia de adopción</p>
      </div>
      <button class="btn-back" @click="$router.push('/userdashboard')">
        <i class="fas fa-arrow-left"></i>
        Volver al Dashboard
      </button>
    </div>

    <!-- Contenido Principal -->
    <div class="profile-container">
      <!-- Información Básica del Usuario -->
      <div class="profile-section">
        <div class="section-header">
          <h2>
            <i class="fas fa-id-card"></i>
            Información de Cuenta
          </h2>
          <p>Datos básicos de tu cuenta</p>
        </div>
        
        <div class="basic-info">
          <div class="avatar-section">
            <div class="avatar-container">
              <img :src="user.profile?.avatar || '/img/default-avatar.jpg'" alt="Avatar" class="avatar" />
              <button class="avatar-edit-btn" @click="triggerAvatarUpload">
                <i class="fas fa-camera"></i>
              </button>
              <input 
                type="file" 
                ref="avatarInput" 
                @change="handleAvatarUpload" 
                accept="image/*" 
                hidden
              />
            </div>
            <div class="avatar-info">
              <h3>{{ user.username }}</h3>
              <p class="user-email">{{ user.email }}</p>
              <p class="member-since">
                <i class="fas fa-calendar"></i>
                Miembro desde {{ joinDate }}
              </p>
              <div v-if="profileCompletion" class="completion-badge" :class="profileCompletion.class">
                {{ profileCompletion.text }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información Personal -->
      <div class="profile-section">
        <div class="section-header">
          <h2>
            <i class="fas fa-user-edit"></i>
            Información Personal
          </h2>
          <p>Datos que nos ayudarán a conocerte mejor</p>
        </div>

        <form @submit.prevent="saveProfile" class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label for="fullName">Nombre Completo *</label>
              <input 
                id="fullName"
                type="text" 
                v-model="profileData.fullName" 
                placeholder="Ej: María González López"
                required
              />
              <small class="field-help">Tu nombre completo como aparece en identificación oficial</small>
            </div>
            
            <div class="form-group">
              <label for="phone">Teléfono *</label>
              <input 
                id="phone"
                type="tel" 
                v-model="profileData.phone" 
                placeholder="Ej: +52 123 456 7890"
                required
              />
              <small class="field-help">Importante para contactarte sobre adopciones</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="birthDate">Fecha de Nacimiento</label>
              <input 
                id="birthDate"
                type="date" 
                v-model="profileData.birthDate"
              />
            </div>
            
            <div class="form-group">
              <label for="occupation">Ocupación</label>
              <input 
                id="occupation"
                type="text" 
                v-model="profileData.occupation" 
                placeholder="Ej: Estudiante, Ingeniero, Docente, etc."
              />
            </div>
          </div>

          <div class="form-group">
            <label for="bio">Biografía</label>
            <textarea 
              id="bio"
              v-model="profileData.bio" 
              rows="4" 
              placeholder="Cuéntanos sobre ti, tu experiencia con mascotas, tu estilo de vida, por qué quieres adoptar..."
              maxlength="500"
            ></textarea>
            <div class="char-counter">{{ profileData.bio?.length || 0 }}/500 caracteres</div>
            <small class="field-help">Esta información ayuda a encontrar la mascota perfecta para ti</small>
          </div>

          <!-- Dirección -->
          <div class="address-section">
            <div class="section-header">
              <h3>
                <i class="fas fa-map-marker-alt"></i>
                Dirección
              </h3>
              <p>Información de tu ubicación (requerida para procesos de adopción)</p>
            </div>

            <div class="form-group">
              <label for="street">Calle y Número *</label>
              <input 
                id="street"
                type="text" 
                v-model="profileData.address.street" 
                placeholder="Ej: Av. Principal #123, Colonia Centro"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="city">Ciudad *</label>
                <input 
                  id="city"
                  type="text" 
                  v-model="profileData.address.city" 
                  placeholder="Ej: Ciudad de México"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="state">Estado *</label>
                <input 
                  id="state"
                  type="text" 
                  v-model="profileData.address.state" 
                  placeholder="Ej: CDMX"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="zipCode">Código Postal *</label>
                <input 
                  id="zipCode"
                  type="text" 
                  v-model="profileData.address.zipCode" 
                  placeholder="Ej: 12345"
                  required
                  maxlength="5"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="references">Referencias Adicionales</label>
              <textarea 
                id="references"
                v-model="profileData.address.references" 
                rows="3" 
                placeholder="Ej: Entre calles A y B, casa de color azul, portón negro, punto de referencia cercano..."
              ></textarea>
              <small class="field-help">Información adicional que ayude a ubicar tu domicilio</small>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="resetForm">
              <i class="fas fa-undo"></i>
              Restablecer
            </button>
            <button type="submit" class="btn-primary" :disabled="!isFormValid || saving">
              <i class="fas fa-save"></i>
              {{ saving ? 'Guardando...' : (isEditMode ? 'Actualizar Perfil' : 'Guardar Perfil') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Profile',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const avatarInput = ref(null)
    const isEditMode = ref(false)
    const saving = ref(false)
    
    const user = computed(() => authStore.user || {})
    
    // Datos del perfil - estructura plana para el formulario
    const profileData = reactive({
      fullName: '',
      phone: '',
      birthDate: '',
      occupation: '',
      bio: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        references: ''
      }
    })

    // Computed properties
    const joinDate = computed(() => {
      if (user.value.createdAt) {
        return new Date(user.value.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long'
        })
      }
      return 'Fecha no disponible'
    })
    
    const isFormValid = computed(() => {
      return profileData.fullName && 
             profileData.phone && 
             profileData.address.street && 
             profileData.address.city && 
             profileData.address.state && 
             profileData.address.zipCode
    })
    
    const profileCompletion = computed(() => {
      const requiredFields = [
        profileData.fullName,
        profileData.phone,
        profileData.address.street,
        profileData.address.city,
        profileData.address.state,
        profileData.address.zipCode
      ]
      
      const completed = requiredFields.filter(field => field && field.trim()).length
      const percentage = (completed / requiredFields.length) * 100
      
      if (percentage === 100) {
        return { text: 'Perfil Completo ✅', class: 'complete' }
      } else if (percentage >= 50) {
        return { text: 'Perfil en Progreso 📝', class: 'progress' }
      } else {
        return { text: 'Perfil Incompleto ⚠️', class: 'incomplete' }
      }
    })

    // Métodos
    const loadUserProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.user) {
            // Actualizar el store también al cargar
            authStore.updateUser(data.user)
            
            // Poblar formularios con datos existentes del perfil
            if (data.user.profile) {
              profileData.fullName = data.user.profile.fullName || ''
              profileData.phone = data.user.profile.phone || ''
              profileData.birthDate = data.user.profile.birthDate || ''
              profileData.occupation = data.user.profile.occupation || ''
              profileData.bio = data.user.profile.bio || ''
              
              profileData.address = {
                street: data.user.profile.address?.street || '',
                city: data.user.profile.address?.city || '',
                state: data.user.profile.address?.state || '',
                zipCode: data.user.profile.address?.zipCode || '',
                references: data.user.profile.address?.references || ''
              }
            }
            isEditMode.value = !!data.user.profile?.profileCompleted
          }
        }
      } catch (error) {
        console.error('Error cargando perfil:', error)
      }
    }

    const saveProfile = async () => {
      saving.value = true
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            profile: profileData
          })
        })
        
        const data = await response.json()
        if (data.success) {
          if (data.pointsEarned > 0) {
            alert(`🎉 ¡Perfil completado exitosamente!\n\n¡Ganaste ${data.pointsEarned} puntos! ✨\nAhora tienes ${data.user.points} puntos totales.`)
          } else {
            alert('✅ Perfil actualizado correctamente')
          }
          
          isEditMode.value = true
          
          // ACTUALIZAR STORE con los nuevos datos del usuario
          if (data.user) {
            authStore.updateUser(data.user)
          }
          
          // REDIRIGIR al dashboard después de guardar
          setTimeout(() => {
            router.push('/userdashboard')
          }, 2000)
          
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error('Error guardando perfil:', error)
        alert('❌ Error al guardar el perfil: ' + error.message)
      } finally {
        saving.value = false
      }
    }
    
    const triggerAvatarUpload = () => {
      avatarInput.value?.click()
    }
    
    const handleAvatarUpload = async (event) => {
      const file = event.target.files[0]
      if (file) {
        // Implementar a futuro upload de avatar
        console.log('Subiendo avatar:', file)
        alert('Función de subida de avatar en desarrollo...')
        
        // Simular upload exitoso
        // const avatarUrl = await uploadAvatar(file)
        // await updateAvatar(avatarUrl)
      }
    }
    
    const updateAvatar = async (avatarUrl) => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile/avatar`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ avatarUrl })
        })
        
        const data = await response.json()
        if (data.success) {
          authStore.setUser(data.user)
          alert('Avatar actualizado correctamente')
        }
      } catch (error) {
        console.error('Error actualizando avatar:', error)
        alert('Error al actualizar avatar')
      }
    }
    
    const resetForm = () => {
      // Recargar datos originales
      loadUserProfile()
    }

    onMounted(() => {
      loadUserProfile()
    })

    return {
      user,
      profileData,
      avatarInput,
      isEditMode,
      saving,
      joinDate,
      isFormValid,
      profileCompletion,
      saveProfile,
      triggerAvatarUpload,
      handleAvatarUpload,
      resetForm
    }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.header-content h1 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.header-content p {
  color: #6c757d;
  margin: 0;
}

.btn-back {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.btn-back:hover {
  background: #5a6268;
}

.profile-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.profile-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.section-header {
  margin-bottom: 25px;
}

.section-header h2 {
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.section-header p {
  color: #6c757d;
  margin: 0;
}

/* Avatar Section */
.basic-info {
  display: flex;
  align-items: center;
  gap: 25px;
}

.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e9ecef;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.avatar-edit-btn:hover {
  background: #0056b3;
}

.avatar-info h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.user-email {
  color: #6c757d;
  margin: 0 0 8px 0;
}

.member-since {
  color: #868e96;
  font-size: 0.9em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

.completion-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: 600;
  margin-top: 8px;
}

.completion-badge.complete {
  background: #d4edda;
  color: #155724;
}

.completion-badge.progress {
  background: #fff3cd;
  color: #856404;
}

.completion-badge.incomplete {
  background: #f8d7da;
  color: #721c24;
}

/* Forms */
.profile-form {
  max-width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #495057;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.char-counter {
  text-align: right;
  font-size: 0.8em;
  color: #6c757d;
  margin-top: 5px;
}

.field-help {
  color: #6c757d;
  font-size: 0.8em;
  margin-top: 5px;
  display: block;
}

/* Address Section */
.address-section {
  margin-top: 30px;
  padding-top: 25px;
  border-top: 2px solid #e9ecef;
}

.address-section .section-header {
  margin-bottom: 20px;
}

.address-section .section-header h3 {
  color: #495057;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 25px;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-page {
    padding: 15px;
  }
  
  .profile-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .basic-info {
    flex-direction: column;
    text-align: center;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .profile-section {
    padding: 20px;
  }
}
</style>