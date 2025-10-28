<template>
  <div class="user-dashboard">
    <!-- Header del Usuario -->
    <div class="user-header">
      <div class="user-profile">
        <div class="avatar">
          <img :src="user.avatar || '/img/default-avatar.jpg'" alt="Avatar" />
          <div class="online-status" :class="{ online: user.isOnline }"></div>
        </div>
        <div class="user-info">
          <h1>{{ user.username }}</h1>
          <p class="user-level">Nivel {{ user.level || 1 }} - {{ getUserTitle }}</p>
          <div class="user-stats">
            <span class="stat">
              <i class="fas fa-paw"></i>
              {{ userPets.length || 0 }} mascotas adoptadas
            </span>
            <span class="stat">
              <i class="fas fa-calendar"></i>
              Miembro desde {{ joinDate }}
            </span>
            <span class="stat">
              <i class="fas fa-user-tag"></i>
              {{ user.role === 'admin' ? 'Administrador 👑' : 'Usuario ⭐' }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Sistema de Puntos -->
      <div class="points-system">
        <div class="points-display">
          <div class="points">
            <i class="fas fa-star"></i>
            <strong>{{ user.points || 0 }}</strong> puntos
          </div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
            <span class="progress-text">
              <!-- ✅ CAMBIADO: Mostrar puntos totales vs puntos para siguiente nivel -->
              Nivel {{ user.level || 1 }}: {{ user.points || 0 }}/{{ pointsForNextLevel || '∞' }} puntos
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navegación SIMPLIFICADA - Solo botones -->
    <div class="user-actions">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['action-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <i :class="tab.icon"></i>
        {{ tab.name }}
      </button>
    </div>

    <!-- Contenido Dinámico -->
    <div class="user-content">
      <!-- Información Personal -->
      <div v-if="activeTab === 'profile'" class="tab-content">
        <h2>Mi Información</h2>
        <div class="profile-info">
          <div class="info-card">
            <h3>Datos Personales</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Nombre de usuario:</label>
                <span>{{ user.username || 'No especificado' }}</span>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <span>{{ user.email || 'No especificado' }}</span>
              </div>
              <div class="info-item">
                <label>Rol:</label>
                <span class="role-badge" :class="user.role">
                  {{ user.role === 'admin' ? '👑 Administrador' : '⭐ Usuario' }}
                </span>
              </div>
              <div class="info-item">
                <label>Miembro desde:</label>
                <span>{{ joinDate }}</span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>Estadísticas</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <i class="fas fa-paw"></i>
                <div class="stat-info">
                  <span class="stat-number">{{ userPets.length || 0 }}</span>
                  <span class="stat-label">Mascotas adoptadas</span>
                </div>
              </div>
              <div class="stat-item">
                <i class="fas fa-star"></i>
                <div class="stat-info">
                  <span class="stat-number">{{ user.points || 0 }}</span>
                  <span class="stat-label">Puntos acumulados</span>
                </div>
              </div>
              <div class="stat-item">
                <i class="fas fa-trophy"></i>
                <div class="stat-info">
                  <span class="stat-number">{{ user.level || 1 }}</span>
                  <span class="stat-label">Nivel actual</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mis Solicitudes de Adopción -->
      <div v-if="activeTab === 'applications'" class="tab-content">
        <h2>Mis Solicitudes de Adopción</h2>
        
        <div class="applications-grid">
          <div v-for="application in userApplications" :key="application.id" class="application-card">
            <div class="application-header">
              <img :src="application.pet.image" :alt="application.pet.name" class="pet-image">
              <div class="pet-basic-info">
                <h3>{{ application.pet.name }}</h3>
                <p class="pet-details">
                  {{ application.pet.breed }} • {{ application.pet.age }} • {{ getSpeciesText(application.pet.species) }}
                </p>
              </div>
            </div>
            
            <div class="application-details">
              <div class="application-status" :class="application.status">
                <i class="fas" :class="getStatusIcon(application.status)"></i>
                {{ getApplicationStatusText(application.status) }}
              </div>
              
              <div class="application-meta">
                <div class="meta-item">
                  <i class="fas fa-calendar"></i>
                  <span>Solicitado: {{ new Date(application.appliedAt).toLocaleDateString('es-ES') }}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-paw"></i>
                  <span>Estado de la mascota: {{ getStatusText(application.pet.status) }}</span>
                </div>
              </div>
              
              <div v-if="application.status === 'rejected'" class="application-note">
                <i class="fas fa-info-circle"></i>
                <span>Tu solicitud fue rechazada. Puedes intentar con otra mascota.</span>
              </div>
              
              <div v-if="application.status === 'approved'" class="application-note success">
                <i class="fas fa-check-circle"></i>
                <span>¡Felicidades! Tu solicitud fue aprobada. Pronto nos contactaremos contigo.</span>
              </div>
            </div>
            
            <div class="application-actions">
              <button 
                v-if="application.status === 'pending' || application.status === 'under_review'"
                class="btn-outline"
                @click="$router.push(`/catalog?pet=${application.pet.id}`)"
              >
                <i class="fas fa-eye"></i>
                Ver Mascota
              </button>
              <button 
                v-if="application.status === 'rejected'"
                class="btn-primary"
                @click="$router.push('/catalog')"
              >
                <i class="fas fa-search"></i>
                Buscar Otra Mascota
              </button>
              <button 
                v-if="application.status === 'completed'"
                class="btn-success"
                @click="$router.push('/user/pets')"
              >
                <i class="fas fa-paw"></i>
                Ver Mi Mascota
              </button>
            </div>
          </div>
          
          <!-- Estado vacío -->
          <div v-if="userApplications.length === 0" class="empty-state">
            <i class="fas fa-file-alt"></i>
            <h3>Aún no tienes solicitudes</h3>
            <p>¡Encuentra tu mascota ideal y envía tu primera solicitud!</p>
            <button class="btn-primary" @click="$router.push('/catalog')">
              <i class="fas fa-search"></i>
              Ver Mascotas Disponibles
            </button>
          </div>
        </div>
      </div>

      <!-- Mis Mascotas -->
      <div v-if="activeTab === 'pets'" class="tab-content">
        <h2>Mis Mascotas</h2>
        
        <div class="pets-grid">
          <div v-for="pet in userPets" :key="pet.id" class="pet-card">
            <div class="pet-image-container">
              <img :src="pet.image" :alt="pet.name" />
              <div class="pet-status-overlay" :class="pet.applicationStatus">
                {{ pet.applicationStatus === 'approved' ? 'Aprobado' : 'Adoptado' }}
              </div>
            </div>
            <div class="pet-info">
              <h3>{{ pet.name }}</h3>
              <p class="pet-details">{{ pet.breed }} • {{ pet.age }}</p>
              <div class="pet-specs">
                <span class="pet-spec">
                  <i class="fas fa-ruler"></i>
                  {{ getSizeText(pet.size) }}
                </span>
                <span class="pet-spec">
                  <i class="fas fa-venus-mars"></i>
                  {{ getGenderText(pet.gender) }}
                </span>
              </div>
              <div class="adoption-date">
                <i class="fas fa-calendar-check"></i>
                Adopción: {{ new Date(pet.appliedAt).toLocaleDateString('es-ES') }}
              </div>
            </div>
          </div>
          
          <div v-if="userPets.length === 0" class="empty-state">
            <i class="fas fa-paw"></i>
            <h3>Aún no tienes mascotas</h3>
            <p>¡Encuentra tu compañero perfecto y comienza el proceso de adopción!</p>
            <button class="btn-primary" @click="$router.push('/catalog')">
              <i class="fas fa-search"></i>
              Buscar Mascotas
            </button>
          </div>
        </div>
      </div>

      <!-- Mis Eventos Registrados -->
      <div v-if="activeTab === 'events'" class="tab-content">
        <h2>Mis Eventos Registrados</h2>
        
        <div class="events-grid">
          <div v-for="event in userEvents" :key="event.id" class="event-card">
            <div class="event-image-container">
              <img :src="event.image" :alt="event.title" class="event-image">
              <div class="event-type-badge" :class="event.type">
                {{ event.typeText }}
              </div>
              <div v-if="event.highlighted" class="event-highlighted">
                <i class="fas fa-star"></i>
                Destacado
              </div>
            </div>
            
            <div class="event-content">
              <h3>{{ event.title }}</h3>
              <p class="event-description">{{ event.description }}</p>
              
              <div class="event-details">
                <div class="event-detail">
                  <i class="fas fa-calendar"></i>
                  <span>{{ event.day }} {{ event.month }} {{ event.year }}</span>
                </div>
                <div class="event-detail">
                  <i class="fas fa-clock"></i>
                  <span>{{ event.time }}</span>
                </div>
                <div class="event-detail">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ event.location }}</span>
                </div>
                <div class="event-detail">
                  <i class="fas fa-users"></i>
                  <span>{{ event.participants }}/{{ event.capacity }} participantes</span>
                </div>
              </div>
              
              <div class="event-actions">
                <button 
                  class="btn-secondary"
                  @click="unregisterFromEvent(event.id)"
                  :disabled="new Date(event.date) < new Date()"
                >
                  <i class="fas fa-times"></i>
                  {{ new Date(event.date) < new Date() ? 'Evento Finalizado' : 'Cancelar Registro' }}
                </button>
                <button 
                  class="btn-secondary"
                  @click="$router.push('/event')"
                >
                  <i class="fas fa-info-circle"></i>
                  Más Detalles
                </button>
              </div>
            </div>
          </div>
          
          <!-- Estado vacío -->
          <div v-if="userEvents.length === 0" class="empty-state">
            <i class="fas fa-calendar"></i>
            <h3>Aún no estás registrado en eventos</h3>
            <p>¡Descubre nuestros eventos y participa en actividades para ayudar a los animales!</p>
            <button class="btn-primary" @click="$router.push('/event')">
              <i class="fas fa-calendar-plus"></i>
              Ver Eventos Disponibles
            </button>
          </div>
        </div>
      </div>

      <!-- Logros - ACTUALIZADO con sistema de reclamación -->
      <div v-if="activeTab === 'achievements'" class="tab-content">
        <h2>Mis Logros</h2>
        
        <!-- Estadísticas de logros -->
        <div class="achievements-stats">
          <div class="stat-card">
            <i class="fas fa-trophy"></i>
            <div class="stat-info">
              <span class="stat-number">{{ unlockedAchievementsCount }}</span>
              <span class="stat-label">Logros Desbloqueados</span>
            </div>
          </div>
          <div class="stat-card">
            <i class="fas fa-star"></i>
            <div class="stat-info">
              <span class="stat-number">{{ claimedAchievementsCount }}</span>
              <span class="stat-label">Recompensas Reclamadas</span>
            </div>
          </div>
          <div class="stat-card">
            <i class="fas fa-gift"></i>
            <div class="stat-info">
              <span class="stat-number">{{ pendingRewardsCount }}</span>
              <span class="stat-label">Recompensas Pendientes</span>
            </div>
          </div>
        </div>

        <div class="achievements-grid">
          <div 
            v-for="achievement in achievements" 
            :key="achievement.id"
            :class="['achievement-card', { 
              unlocked: achievement.unlocked, 
              awarded: achievement.awarded,
              pending: achievement.unlocked && !achievement.awarded
            }]"
          >
            <div class="achievement-icon">
              <i :class="achievement.icon"></i>
            </div>
            <div class="achievement-info">
              <h4>{{ achievement.name }}</h4>
              <p>{{ achievement.description }}</p>
              
              <!-- INFORMACIÓN DE PUNTOS CLARA -->
              <div class="achievement-points-info">
                <span class="points-value">💎 Valor: {{ achievement.pointsValue }} pts</span>
                <span v-if="achievement.pointsReward" class="points-reward">
                  🎁 +{{ achievement.pointsReward }} pts EXTRA
                </span>
              </div>
            </div>
            
            <!-- ESTADOS DEL LOGRO -->
            <div class="achievement-status">
              <!-- No desbloqueado -->
              <div v-if="!achievement.unlocked" class="status-locked">
                <i class="fas fa-lock"></i>
                <span>Bloqueado</span>
              </div>
              
              <!-- Desbloqueado y reclamado -->
              <div v-else-if="achievement.awarded" class="status-claimed">
                <i class="fas fa-check-circle"></i>
                <span>¡Reclamado!</span>
              </div>
              
              <!-- Desbloqueado pero NO reclamado -->
              <div v-else class="status-pending">
                <button 
                  class="claim-btn"
                  @click="claimAchievement(achievement.id)"
                  :disabled="claimingAchievement === achievement.id"
                >
                  <i class="fas" :class="claimingAchievement === achievement.id ? 'fa-spinner fa-spin' : 'fa-gift'"></i>
                  Reclamar +{{ achievement.pointsReward }} pts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actividad Reciente -->
      <div v-if="activeTab === 'activity'" class="tab-content">
        <h2>Actividad Reciente</h2>
        <div class="activity-feed">
          <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
            <div class="activity-icon">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <p>{{ activity.message }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
            <div v-if="activity.points" class="activity-points">
              +{{ activity.points }} pts
            </div>
          </div>
          
          <div v-if="recentActivity.length === 0" class="empty-state">
            <i class="fas fa-history"></i>
            <h3>Aún no tienes actividad</h3>
            <p>¡Comienza a usar la plataforma para ver tu actividad aquí!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón flotante para adopción -->
    <button class="floating-btn" @click="$router.push('/adoption')">
      <i class="fas fa-plus"></i>
      Solicitar Adopción
    </button>

  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'UserDashboard',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const activeTab = ref('profile') 
    const showAdoptionForm = ref(false)
    const claimingAchievement = ref(null) 

    // Función para recargar datos del usuario desde el backend
    const refreshUserData = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        const data = await response.json()
        if (data.success && data.user) {
          authStore.updateUser(data.user) 
          console.log('Datos del usuario actualizados:', data.user)
        }
      } catch (error) {
        console.error('Error actualizando datos del usuario:', error)
      }
    }

    // Obtener usuario REAL desde Pinia
    const user = computed(() => authStore.user || {})

    // Navegación actualizada
    const tabs = [
      { id: 'profile', name: 'Mi Perfil', icon: 'fas fa-user' },
      { id: 'applications', name: 'Mis Solicitudes', icon: 'fas fa-file-alt' },
      { id: 'pets', name: 'Mis Mascotas', icon: 'fas fa-paw' },
      { id: 'events', name: 'Mis Eventos', icon: 'fas fa-calendar' },
      { id: 'achievements', name: 'Logros', icon: 'fas fa-trophy' },
      { id: 'activity', name: 'Actividad', icon: 'fas fa-history' }
    ]

    // Computed properties CORREGIDAS - TODO viene del backend
    const joinDate = computed(() => {
      if (user.value.createdAt) {
        return new Date(user.value.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long'
        })
      }
      return 'Recientemente'
    })

    const getUserTitle = computed(() => {
      const level = user.value.level || 1
      
      // Títulos basados en NIVEL
      const levelTitles = {
        1: 'Protector Novato 🐣',
        2: 'Amigo Animal 🐕',
        3: 'Cuidador Experto 🛡️',
        4: 'Héroe Animal 🦸',
        5: 'Leyenda Viviente 👑',
      };

      return levelTitles[level] || `Nivel ${level}`
    })

    // Puntos dentro del rango actual 
    const currentLevelPoints = computed(() => {
      const points = user.value.points || 0

      if (points < 100) return points                  // Nivel 1 (0–99)
      if (points < 300) return points - 100            // Nivel 2 (100–299)
      if (points < 600) return points - 300            // Nivel 3 (300–599)
      if (points < 1000) return points - 600           // Nivel 4 (600–999)
      return points - 1000                             // Nivel 5+ (1000+)
    })

    // Porcentaje de progreso basado en puntos totales vs siguiente nivel
    const progressPercentage = computed(() => {
      const points = user.value.points || 0
      const nextLevelPoints = pointsForNextLevel.value
      
      // Si es nivel máximo o no hay siguiente nivel
      if (!nextLevelPoints || user.value.level >= 5) {
        return 100
      }
      
      // Calcular porcentaje: puntos actuales / puntos necesarios para siguiente nivel
      const progress = (points / nextLevelPoints) * 100
      return Math.min(progress, 100)
    })
    // Puntos necesarios para el SIGUIENTE nivel
    const pointsForNextLevel = computed(() => {
      const currentLevel = user.value.level || 1
      
      // ✅ Según tu sistema de 5 niveles en User.js
      const levelThresholds = {
        1: 100,   // Para nivel 2
        2: 300,   // Para nivel 3  
        3: 600,   // Para nivel 4
        4: 1000,  // Para nivel 5
        5: null   // Nivel máximo
      }
      
      return levelThresholds[currentLevel]
    })

    // Datos del usuario
    const userPets = ref([])
    const userApplications = ref([])
    const userEvents = ref([])
    const achievements = ref([])
    const recentActivity = ref([])

    // Formulario de adopción
    const adoptionForm = reactive({
      petType: 'dog',
      reason: ''
    })

    // Métodos
    const getStatusText = (status) => {
      const statusMap = {
        adopted: 'Adoptado',
        pending: 'En proceso',
        available: 'Disponible'
      }
      return statusMap[status] || status
    }

    const submitAdoption = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/adoption-request`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(adoptionForm)
        })

        const data = await response.json()
        
        if (data.success) {
          showAdoptionForm.value = false
          alert(`¡Solicitud enviada! Ganaste ${data.pointsEarned} puntos 🎉`)
          // Recargar datos del usuario para puntos en tiempo real
          await refreshUserData()
          await loadUserData()
          // Limpiar formulario
          adoptionForm.petType = 'dog'
          adoptionForm.reason = ''
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error('Error enviando solicitud:', error)
        alert(error.message || 'Error enviando solicitud')
      }
    }

    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        // Cargar solicitudes de adopción
        const appsResponse = await fetch(`${import.meta.env.VITE_API_URL}/adoptions/my-applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const appsData = await appsResponse.json()
        
        if (appsData.success) {
          userApplications.value = appsData.applications
          // Mascotas adoptadas = solicitudes aprobadas o completadas
          userPets.value = appsData.applications
            .filter(app => app.status === 'approved' || app.status === 'completed')
            .map(app => ({
              ...app.pet,
              applicationStatus: app.status,
              appliedAt: app.appliedAt
            }))
        }

        // Cargar eventos registrados
        const eventsResponse = await fetch(`${import.meta.env.VITE_API_URL}/events/my-events`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const eventsData = await eventsResponse.json()

        if (eventsData.success) {
          userEvents.value = eventsData.events.map(event => ({
            ...event,
            date: event.fullDate,
            typeText: event.typeText || (event.type === 'adoption' ? 'Adopción' : 
                                      event.type === 'volunteer' ? 'Voluntariado' : 
                                      event.type === 'fundraising' ? 'Recaudación' : 'Educativo')
          }))
        } else {
          userEvents.value = []
        }

        // Cargar logros
        const achievementsResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/achievements`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const achievementsData = await achievementsResponse.json()
        
        if (achievementsData.success) {
          achievements.value = achievementsData.achievements
        }

        // Cargar actividad
        const activityResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/activity`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const activityData = await activityResponse.json()
        
        if (activityData.success) {
          recentActivity.value = activityData.activity
        }

        console.log('Todos los datos del usuario cargados correctamente')

      } catch (error) {
        console.error('Error cargando datos del usuario:', error)
      }
    }

    // Función para estados de solicitud
    const getApplicationStatusText = (status) => {
      const statusMap = {
        pending: 'Pendiente',
        under_review: 'En revisión',
        approved: 'Aprobada 🎉',
        rejected: 'Rechazada',
        completed: 'Completada ✅'
      }
      return statusMap[status] || status
    }

    // Función para cancelar registro a eventos
    const unregisterFromEvent = async (eventId) => {
      try {
        if (!confirm('¿Estás seguro de que quieres cancelar tu registro en este evento?')) {
          return
        }

        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}/unregister`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        const data = await response.json()
        if (data.success) {
          await refreshUserData()
          await loadUserData()
          alert('Registro cancelado exitosamente')
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error('Error cancelando registro:', error)
        alert(error.message || 'Error al cancelar registro')
      }
    }

    // Reclamar puntos de logro
    const claimAchievement = async (achievementId) => {
      try {
        claimingAchievement.value = achievementId
        
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/achievements/${achievementId}/claim`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        const data = await response.json()
        
        if (data.success) {
          // Recargar usuario y logros
          await refreshUserData()
          await loadUserData() 
          
          // Mostrar feedback
          alert(`🎉 ${data.message}`)
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error('Error reclamando logro:', error)
        alert(error.message || 'Error al reclamar logro')
      } finally {
        claimingAchievement.value = null
      }
    }

    // Función para actualizar puntos después de acciones de gamificación
    const refreshPoints = async () => {
      await refreshUserData()
    }

    // AGREGA ESTAS FUNCIONES EN EL SETUP() - DESPUÉS DE loadUserData
    const getSpeciesText = (species) => {
      const speciesMap = {
        dog: 'Perro',
        cat: 'Gato',
        bird: 'Ave',
        rabbit: 'Conejo',
        other: 'Otro'
      }
      return speciesMap[species] || species
    }

    const getSizeText = (size) => {
      const sizeMap = {
        small: 'Pequeño',
        medium: 'Mediano', 
        large: 'Grande',
        extra_large: 'Extra Grande'
      }
      return sizeMap[size] || size
    }

    const getGenderText = (gender) => {
      const genderMap = {
        male: 'Macho',
        female: 'Hembra'
      }
      return genderMap[gender] || gender
    }

    const getStatusIcon = (status) => {
      const iconMap = {
        pending: 'fa-clock',
        under_review: 'fa-search',
        approved: 'fa-check-circle',
        rejected: 'fa-times-circle',
        completed: 'fa-trophy'
      }
      return iconMap[status] || 'fa-question-circle'
    }

    // Estadísticas de logros
    const unlockedAchievementsCount = computed(() => {
      return achievements.value.filter(ach => ach.unlocked).length
    })

    const claimedAchievementsCount = computed(() => {
      return achievements.value.filter(ach => ach.awarded).length
    })

    const pendingRewardsCount = computed(() => {
      return achievements.value.filter(ach => ach.unlocked && !ach.awarded).length
    })

    onMounted(async () => {
      // FORZAR recarga de datos del usuario desde el backend PRIMERO
      await refreshUserData()
      
      // Cargar el resto de datos
      await loadUserData()
    })

    return {
      activeTab,
      showAdoptionForm,
      user,
      tabs,
      userPets,
      achievements,
      recentActivity,
      userApplications,
      userEvents,
      adoptionForm,
      progressPercentage,
      pointsForNextLevel,
      currentLevelPoints,
      joinDate,
      getUserTitle,
      userApplications,
      getSpeciesText,
      getSizeText,
      getGenderText,
      getStatusIcon,
      getApplicationStatusText,
      unregisterFromEvent,
      loadUserData,
      refreshUserData, 
      refreshPoints,   
      getStatusText,
      submitAdoption,
      unlockedAchievementsCount,
      claimedAchievementsCount,
      pendingRewardsCount,
      claimAchievement,
      claimingAchievement,
      router
    }
  }
}
</script>

<style scoped>
  .user-dashboard {
  max-width: 1200px;
  margin: 120px auto 50px;
  padding: 0 20px;
}

/* Header del Usuario */
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  position: relative;
  width: 80px;
  height: 80px;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.online-status {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #ccc;
  border: 2px solid white;
}

.online-status.online {
  background: #10b981;
}

.user-info h1 {
  margin: 0;
  color: #2d3748;
  font-size: 1.8rem;
}

.user-level {
  color: #ff9a24;
  font-weight: 600;
  margin: 5px 0;
}

.user-stats {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #718096;
  font-size: 0.9rem;
}

/* Sistema de Puntos */
.points-system {
  text-align: right;
}

.points {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  color: #ff9a24;
  margin-bottom: 10px;
}

.progress-bar {
  width: 300px;
  height: 20px;
  background: #e2e8f0;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(135deg, #ff9a24, #ff6b6b);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  color: #4a5568;
  font-weight: 600;
}

/* Navegación SIMPLIFICADA */
.user-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #718096;
}

.action-btn.active {
  background: #ff9a24;
  border-color: #ff9a24;
  color: white;
}

.action-btn:hover:not(.active) {
  border-color: #ff9a24;
  color: #ff9a24;
}

/* Contenido */
.user-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.tab-content h2 {
  margin: 0 0 25px 0;
  color: #2d3748;
  border-bottom: 2px solid #ff9a24;
  padding-bottom: 10px;
}

/* Grid de Mascotas */
.pets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.pet-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.pet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.pet-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.pet-info {
  padding: 15px;
}

.pet-info h3 {
  margin: 0 0 5px 0;
  color: #2d3748;
}

.pet-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 8px;
}

.pet-status.adopted {
  background: #c6f6d5;
  color: #22543d;
}

.pet-status.pending {
  background: #fed7d7;
  color: #742a2a;
}

/* Logros */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.achievement-card.unlocked {
  opacity: 1;
  border-color: #ff9a24;
  background: #fffaf0;
}

.achievement-icon {
  width: 50px;
  height: 50px;
  background: #ff9a24;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  margin: 0 0 5px 0;
  color: #2d3748;
}

.achievement-info p {
  margin: 0;
  color: #718096;
  font-size: 0.9rem;
}

.achievement-points {
  color: #ff9a24;
  font-weight: 600;
  font-size: 0.8rem;
}

.achievement-badge {
  color: #10b981;
  font-size: 1.2rem;
}

/* Actividad */
.activity-feed {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.activity-item:hover {
  background: #f7fafc;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: #edf2f7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff9a24;
}

.activity-content {
  flex: 1;
}

.activity-content p {
  margin: 0;
  color: #2d3748;
}

.activity-time {
  color: #718096;
  font-size: 0.8rem;
}

.activity-points {
  color: #ff9a24;
  font-weight: 600;
}

/* Formularios */
.settings-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #2d3748;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff9a24;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
  cursor: pointer;
}

/* Botones */
.btn-primary {
  background: #ff9a24;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  background: #e6891f;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

/* Botón flotante */
.floating-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #ff9a24;
  color: white;
  border: none;
  padding: 15px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(255, 154, 36, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  z-index: 100;
}

.floating-btn:hover {
  background: #e6891f;
  transform: translateY(-2px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin: 0 0 20px 0;
  color: #2d3748;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
  grid-column: 1 / -1;
}

.empty-state i {
  font-size: 3rem;
  color: #e2e8f0;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #4a5568;
}

/* Responsive */
@media (max-width: 768px) {
  .user-dashboard {
    margin: 100px auto 30px;
    padding: 0 15px;
  }
  .user-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  .user-profile {
    flex-direction: column;
    text-align: center;
  }
  .user-stats {
    justify-content: center;
  }
  .progress-bar {
    width: 100%;
  }
  .user-actions {
    justify-content: center;
  }
  .action-btn {
    flex: 1;
    min-width: 140px;
    justify-content: center;
  }
  .pets-grid {
    grid-template-columns: 1fr;
  }
  .achievements-grid {
    grid-template-columns: 1fr;
  }
  .floating-btn {
    bottom: 20px;
    right: 20px;
    padding: 12px 16px;
    font-size: 0.9rem;
  }
  .modal {
    padding: 20px;
    margin: 20px;
  }
  .form-actions {
    flex-direction: column;
  }

  .info-item {
    flex-direction: column; /* Para que label y valor estén en vertical */
    align-items: flex-start;
    gap: 4px;
  }

  .info-item span {
    font-size: 0.9rem;
    word-break: break-word; /* Rompe correos o textos largos */
    overflow-wrap: break-word;
  }
}

@media (max-width: 480px) {
  .user-header {
    padding: 20px;
  }
  .user-content {
    padding: 20px;
  }
  .action-btn {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  .user-actions {
    gap: 10px;
  }
  .floating-btn {
    bottom: 15px;
    right: 15px;
    padding: 10px 14px;
    font-size: 0.8rem;
  }
  .info-item span {
    font-size: 0.8rem;
  }
}

.profile-info {
  display: grid;
  gap: 1.5rem;
}

.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.info-grid {
  display: grid;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item label {
  font-weight: 600;
  color: #666;
  min-width: 150px;
}

.info-item span {
  color: #333;
}

.role-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.role-badge.admin {
  background: #ffd700;
  color: #000;
}

.role-badge.user {
  background: #4a6cf7;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-item i {
  font-size: 1.5rem;
  color: #4a6cf7;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}

/* Estilos para las nuevas secciones */
.applications-grid {
  display: grid;
  gap: 1.5rem;
}

.application-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-left: 4px solid #e0e0e0;
}

.application-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.pet-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.application-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.application-status.pending {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.application-status.under_review {
  background: #cce7ff;
  color: #004085;
  border: 1px solid #b3d7ff;
}

.application-status.approved {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.application-status.rejected {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f1b0b7;
}

.application-status.completed {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.application-meta {
  display: grid;
  gap: 0.5rem;
  margin: 1rem 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.application-note {
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 6px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.application-note.success {
  background: #d4edda;
  color: #155724;
}

.application-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Estilos para eventos */
.events-grid {
  display: grid;
  gap: 1.5rem;
}

.event-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.event-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-type-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.event-type-badge.adoption {
  background: #ff6b6b;
}

.event-type-badge.fundraising {
  background: #4ecdc4;
}

.event-type-badge.volunteer {
  background: #45b7d1;
}

.event-type-badge.educational {
  background: #96ceb4;
}

.event-highlighted {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #ffd700;
  color: #000;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.event-content {
  padding: 1.5rem;
}

.event-details {
  display: grid;
  gap: 0.75rem;
  margin: 1rem 0;
}

.event-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.event-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Estilos para mascotas mejorados */
.pet-image-container {
  position: relative;
}

.pet-status-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.pet-status-overlay.approved {
  background: #28a745;
}

.pet-status-overlay.completed {
  background: #17a2b8;
}

.pet-specs {
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0;
}

.pet-spec {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #666;
}

.adoption-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #888;
  margin-top: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ccc;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.empty-state p {
  margin-bottom: 1.5rem;
}

/* Botones mejorados */
.btn-outline.warning {
  border-color: #ffc107;
  color: #856404;
}

.btn-outline.warning:hover {
  background: #ffc107;
  color: #000;
}

/* Estilos para badges de estado de mascota */
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
}

.status-badge.disponible {
  background: #4CAF50;
  color: white;
}

.status-badge.en\ proceso {
  background: #FF9800;
  color: white;
}

.status-badge.adoptado {
  background: #F44336;
  color: white;
}

/* Mejora para los botones de acción */
.application-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-outline.warning {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.btn-outline.warning:hover {
  background: #ff6b6b;
  color: white;
}

/* Notas de aplicación */
.application-note.warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
}

.application-note.success {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
}

/* Estilos para el sistema de reclamación de logros */
.achievements-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  border-left: 4px solid #4CAF50;
}

.stat-card i {
  font-size: 2rem;
  color: #4CAF50;
  margin-bottom: 0.5rem;
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.achievement-points-info {
  margin-top: 0.5rem;
}

.points-value {
  display: block;
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
}

.points-reward {
  display: block;
  font-size: 0.9rem;
  color: #e67e22;
  font-weight: bold;
}

.achievement-status {
  margin-top: 1rem;
}

.status-locked, .status-claimed {
  text-align: center;
  padding: 0.5rem;
  border-radius: 5px;
  font-size: 0.9rem;
}

.status-locked {
  background: #f8f9fa;
  color: #95a5a6;
}

.status-claimed {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-pending {
  text-align: center;
}

.claim-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.claim-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.claim-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Estados de las tarjetas de logro */
.achievement-card.pending {
  border: 2px solid #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.achievement-card.awarded {
  opacity: 0.8;
}
</style>