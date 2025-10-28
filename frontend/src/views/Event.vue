<template>
  <!-- Hero Section -->
  <section class="events-hero">
    <div class="events-hero-content">
      <h1>Eventos y Actividades</h1>
      <p>Únete a nuestros eventos especiales y ayuda a más animales a encontrar un hogar</p>
      <div class="events-hero-buttons">
        <button class="events-btn events-btn-primary" @click="scrollToEvents">
          Ver Eventos
        </button>
        <button class="events-btn events-btn-secondary" @click="$router.push('/contact')">
          Proponer un Evento
        </button>
      </div>
    </div>
  </section>

  <!-- Próximos Eventos Destacados -->
  <section class="events-featured" ref="eventsSection">
    <div class="events-container">
      <div class="events-header">
        <i class="fa-solid fa-calendar-star"></i>
        <h2>Próximos Eventos Destacados</h2>
        <p>No te pierdas estas oportunidades especiales para ayudar a nuestros amigos peludos</p>
      </div>

      <div class="featured-events-grid">
        <div 
          v-for="event in featuredEvents" 
          :key="event.id" 
          class="featured-event-card"
          :class="{ 'highlighted': event.highlighted }"
        >
          <div class="event-date">
            <div class="event-day">{{ event.day }}</div>
            <div class="event-month">{{ event.month }}</div>
          </div>
          <div class="event-image">
            <img :src="event.image" :alt="event.title" />
            <div class="event-type-badge" :class="event.type">
              {{ event.typeText }}
            </div>
          </div>
          <div class="event-content">
            <h3>{{ event.title }}</h3>
            <div class="event-meta">
              <div class="meta-item">
                <i class="fa-solid fa-clock"></i>
                <span>{{ event.time }}</span>
              </div>
              <div class="meta-item">
                <i class="fa-solid fa-location-dot"></i>
                <span>{{ event.location }}</span>
              </div>
              <div class="meta-item">
                <i class="fa-solid fa-users"></i>
                <span>{{ event.participants }}/{{ event.capacity }} participantes</span>
              </div>
            </div>
            <p class="event-description">{{ event.description }}</p>
            <div class="event-actions">
              <button 
                class="events-btn events-btn-small events-btn-primary"
                @click="registerForEvent(event)"
                :disabled="getButtonDisabled(event) || loadingStates[event.id]"
              >
                <i class="fa-solid" :class="getButtonIcon(event)"></i>
                {{ getButtonText(event) }}
              </button>
              <button class="events-btn events-btn-small events-btn-outline" @click="shareEvent(event)">
                <i class="fa-solid fa-share-nodes"></i>
                Compartir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Todos los Eventos -->
  <section class="events-all">
    <div class="events-container">
      <div class="events-filter">
        <h3>Calendario de Eventos</h3>
        <div class="filter-options">
          <button 
            v-for="filter in eventFilters" 
            :key="filter.value"
            class="filter-btn"
            :class="{ 'active': activeFilter === filter.value }"
            @click="setFilter(filter.value)"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <div class="events-timeline">
        <div 
          v-for="event in filteredEvents" 
          :key="event.id" 
          class="timeline-event"
        >
          <div class="timeline-date">
            <div class="timeline-day">{{ event.day }}</div>
            <div class="timeline-month">{{ event.month }}</div>
            <div class="timeline-year">{{ event.year }}</div>
          </div>
          <div class="timeline-content">
            <div class="timeline-header">
              <h4>{{ event.title }}</h4>
              <span class="event-category" :class="event.type">
                {{ event.typeText }}
              </span>
            </div>
            <div class="timeline-meta">
              <span><i class="fa-solid fa-clock"></i> {{ event.time }}</span>
              <span><i class="fa-solid fa-location-dot"></i> {{ event.location }}</span>
              <span><i class="fa-solid fa-user-group"></i> {{ event.participants }}/{{ event.capacity }}</span>
            </div>
            <p class="timeline-description">{{ event.description }}</p>
            <div class="timeline-actions">
              <button class="events-btn events-btn-small events-btn-primary" @click="showEventDetails(event)">
                Más Información
              </button>
              <button 
                class="events-btn events-btn-small events-btn-outline"
                @click="toggleRegistration(event)"
                :disabled="getButtonDisabled(event) || loadingStates[event.id]"
              >
                <i class="fa-solid" :class="getButtonIcon(event)"></i>
                {{ getButtonText(event) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Modal de Detalles del Evento -->
  <div v-if="selectedEvent" class="event-modal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">×</button>
      <div class="modal-grid">
        <div class="modal-image">
          <img :src="selectedEvent.image" :alt="selectedEvent.title" />
        </div>
        <div class="modal-info">
          <div class="modal-header">
            <h2>{{ selectedEvent.title }}</h2>
            <span class="event-category-large" :class="selectedEvent.type">
              {{ selectedEvent.typeText }}
            </span>
          </div>
          
          <div class="event-details">
            <div class="detail-row">
              <i class="fa-solid fa-calendar"></i>
              <div>
                <strong>Fecha:</strong> {{ selectedEvent.fullDate }}
              </div>
            </div>
            <div class="detail-row">
              <i class="fa-solid fa-clock"></i>
              <div>
                <strong>Hora:</strong> {{ selectedEvent.time }}
              </div>
            </div>
            <div class="detail-row">
              <i class="fa-solid fa-location-dot"></i>
              <div>
                <strong>Ubicación:</strong> {{ selectedEvent.location }}
              </div>
            </div>
            <div class="detail-row">
              <i class="fa-solid fa-users"></i>
              <div>
                <strong>Participantes:</strong> {{ selectedEvent.participants }}/{{ selectedEvent.capacity }}
              </div>
            </div>
            <div class="detail-row">
              <i class="fa-solid fa-person"></i>
              <div>
                <strong>Organizador:</strong> {{ selectedEvent.organizer }}
              </div>
            </div>
          </div>

          <div class="event-full-description">
            <h4>Acerca de este evento</h4>
            <p>{{ selectedEvent.fullDescription }}</p>
          </div>

          <div class="event-requirements" v-if="selectedEvent.requirements">
            <h4>Requisitos</h4>
            <ul>
              <li v-for="(requirement, index) in selectedEvent.requirements" :key="index">
                {{ requirement }}
              </li>
            </ul>
          </div>

          <div class="modal-actions">
            <button 
              class="events-btn events-btn-large events-btn-primary"
              @click="toggleRegistration(selectedEvent)"
              :disabled="getButtonDisabled(selectedEvent) || loadingStates[selectedEvent.id]"
            >
              <i class="fa-solid" :class="getButtonIcon(selectedEvent)"></i>
              {{ getButtonText(selectedEvent) }}
            </button>
            <button class="events-btn events-btn-large events-btn-outline" @click="shareEvent(selectedEvent)">
              <i class="fa-solid fa-share-nodes"></i>
              Compartir Evento
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- CTA Section -->
  <div class="cta-content">
    <h2>¿Tienes una idea para un evento?</h2>
    <p>Colaboremos juntos para organizar más actividades que ayuden a nuestros amigos peludos</p>
    <button class="events-btn events-btn-large events-btn-primary" @click="$router.push('/contact')">
      <i class="fa-solid fa-lightbulb"></i>
      Proponer un Evento
    </button>
    <br><br><br>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Events',
  setup() {
    const router = useRouter()
    const eventsSection = ref(null)
    const selectedEvent = ref(null)
    const activeFilter = ref('all')
    const events = ref([])
    const loadingStates = ref({}) 

    const eventFilters = [
      { value: 'all', label: 'Todos los eventos' },
      { value: 'adoption', label: 'Ferias de adopción' },
      { value: 'fundraising', label: 'Recaudación de fondos' },
      { value: 'volunteer', label: 'Voluntariado' },
      { value: 'educational', label: 'Charlas educativas' }
    ]

    const API_BASE_URL = import.meta.env.VITE_API_URL

    // Verificar autenticación
    const isAuthenticated = computed(() => {
      return !!localStorage.getItem('auth_token')
    })

    const getAuthToken = () => {
      return localStorage.getItem('auth_token')
    }

    // Cargar eventos desde API
    const loadEvents = async () => {
      try {
        const token = getAuthToken()
        const headers = {
          'Content-Type': 'application/json'
        }
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        // Cargar todos los eventos
        const response = await fetch(`${API_BASE_URL}/events`, {
          headers
        })
        
        const data = await response.json()
        
        if (data.success) {
          let eventsWithRegistration = data.events
          
          // Si hay usuario autenticado, cargar SUS eventos registrados
          if (token) {
            try {
              const myEventsResponse = await fetch(`${API_BASE_URL}/events/my-events`, {
                headers: { 'Authorization': `Bearer ${token}` }
              })
              const myEventsData = await myEventsResponse.json()
              
              if (myEventsData.success) {
                const userEventIds = myEventsData.events.map(event => event.id)
                
                // 3. Combinar: marcar como registered los eventos del usuario
                eventsWithRegistration = data.events.map(event => ({
                  ...event,
                  registered: userEventIds.includes(event.id) // ✅ ESTO ES CLAVE
                }))
                
                console.log('Eventos con registro actualizado:', eventsWithRegistration)
              }
            } catch (error) {
              console.error('Error cargando eventos del usuario:', error)
            }
          }
          
          events.value = eventsWithRegistration
        } else {
          console.error('Error cargando eventos:', data.message)
          events.value = getDefaultEvents()
        }
      } catch (error) {
        console.error('Error cargando eventos:', error)
        events.value = getDefaultEvents()
      }
    }

    // Datos por defecto (backup)
    const getDefaultEvents = () => {
      return [
        {
          id: 1,
          title: "Evento de Ejemplo",
          type: "adoption",
          typeText: "Feria de Adopción",
          description: "Evento de ejemplo mientras se carga la API",
          participants: 0,
          capacity: 50,
          registered: false,
          highlighted: true,
          day: "15",
          month: "JUL",
          year: "2024",
          time: "10:00 AM",
          location: "Ubicación ejemplo",
          image: "/img/event-adoption-fair.jpg"
        }
      ]
    }

    // Helper functions para los botones - MEJORADA
    const getButtonText = (event) => {
      if (loadingStates.value[event.id]) return 'Procesando...'
      if (event.registered) return 'Inscrito ✓'
      if (event.participants >= event.capacity) return 'Evento Lleno'
      if (!isAuthenticated.value) return 'Iniciar Sesión'
      return 'Inscribirse'
    }

    const getButtonIcon = (event) => {
      if (loadingStates.value[event.id]) return 'fa-spinner fa-spin'
      if (event.registered) return 'fa-check-circle'
      if (event.participants >= event.capacity) return 'fa-users-slash'
      if (!isAuthenticated.value) return 'fa-sign-in-alt'
      return 'fa-calendar-plus'
    }

    const getButtonDisabled = (event) => {
      return loadingStates.value[event.id] || event.registered || event.participants >= event.capacity
    }

    // Función principal de registro
    const toggleRegistration = async (event) => {
      // Si no está autenticado, redirigir a login
      if (!isAuthenticated.value) {
        router.push(`/login?redirect=${router.currentRoute.value.path}`)
        return
      }

      // Si ya está registrado, cancelar registro
      if (event.registered) {
        await unregisterFromEvent(event)
      } else {
        await registerForEvent(event)
      }
    }

    // Registrar en evento - VERSIÓN CORREGIDA
    const registerForEvent = async (event) => {
      try {
        // Set loading state
        loadingStates.value[event.id] = true
        
        const token = getAuthToken()
        const response = await fetch(`${API_BASE_URL}/events/${event.id}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (data.success) {
          // RECARGAR EVENTOS COMPLETAMENTE para que UserDashboard vea los cambios
          await loadEvents()
          alert('¡Te has registrado exitosamente al evento!')
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error('Error registrando en evento:', error)
        alert(error.message || 'Error al registrar en el evento')
        
        // Recargar eventos para tener datos actualizados
        await loadEvents()
      } finally {
        loadingStates.value[event.id] = false
      }
    }

    // Cancelar registro
    const unregisterFromEvent = async (event) => {
      try {
        if (!confirm('¿Estás seguro de que quieres cancelar tu registro?')) {
          return
        }

        loadingStates.value[event.id] = true
        
        const token = getAuthToken()
        const response = await fetch(`${API_BASE_URL}/events/${event.id}/unregister`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (data.success) {
          // RECARGAR EVENTOS COMPLETAMENTE para que UserDashboard vea los cambios
          await loadEvents()
          alert('Registro cancelado exitosamente')
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error('Error cancelando registro:', error)
        alert(error.message || 'Error al cancelar registro')
        
        // Recargar eventos para tener datos actualizados
        await loadEvents()
      } finally {
        loadingStates.value[event.id] = false
      }
    }

    // Función para el botón "Confirmar Asistencia" (alias de toggleRegistration)
    const registerForEventAlias = (event) => {
      toggleRegistration(event)
    }

    const featuredEvents = computed(() => {
      return events.value.filter(event => event.highlighted).slice(0, 3)
    })

    const filteredEvents = computed(() => {
      if (activeFilter.value === 'all') {
        return events.value
      }
      return events.value.filter(event => event.type === activeFilter.value)
    })

    const scrollToEvents = () => {
      eventsSection.value?.scrollIntoView({ behavior: 'smooth' })
    }

    const showEventDetails = (event) => {
      selectedEvent.value = event
    }

    const closeModal = () => {
      selectedEvent.value = null
    }

    const shareEvent = async (event) => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: event.title,
            text: event.description,
            url: window.location.href
          });
          
          // Llamar al endpoint de compartir si está autenticado
          if (isAuthenticated.value) {
            try {
              const token = getAuthToken();
              const response = await fetch(`${API_BASE_URL}/events/${event.id}/share`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              const data = await response.json();
              if (data.success) {
                console.log('+15 puntos por compartir evento');
              }
            } catch (error) {
              console.error('Error registrando puntos por compartir:', error);
            }
          }
        } catch (error) {
          console.log('Compartir cancelado');
        }
      } else {
        // Fallback para navegadores sin Web Share API
        navigator.clipboard.writeText(`${event.title} - ${window.location.href}`);
        alert('Enlace copiado al portapapeles!');
        
        // También dar puntos en el fallback
        if (isAuthenticated.value) {
          try {
            const token = getAuthToken();
            await fetch(`${API_BASE_URL}/events/${event.id}/share`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            console.log('+15 puntos por compartir evento (fallback)');
          } catch (error) {
            console.error('Error registrando puntos por compartir:', error);
          }
        }
      }
    }

    const setFilter = (filter) => {
      activeFilter.value = filter
    }

    onMounted(() => {
      loadEvents()
    })

    return {
      eventsSection,
      featuredEvents,
      filteredEvents,
      selectedEvent,
      eventFilters,
      activeFilter,
      loadingStates,
      scrollToEvents,
      showEventDetails,
      closeModal,
      toggleRegistration,
      registerForEvent: registerForEventAlias,
      shareEvent,
      setFilter,
      getButtonText,
      getButtonIcon,
      getButtonDisabled
    }
  }
}
</script>

<style scoped>
/* Estilos del Hero */
.events-hero {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("img/hero-background-image.png");
  text-align: center;
  color: #131313;
  padding: 80px 20px;
}

.events-hero-content h1 {
  font-size: 64px;
  font-weight: 900;
  margin-bottom: 20px;
}

.events-hero-content p {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 40px;
}

.events-hero-buttons {
  display: flex;
  gap: 24px;
  justify-content: center;
}

/* Botones */
.events-btn {
  padding: 12px 24px;
  font-size: clamp(1rem, 2vw, 1.5rem);
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-out;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.events-btn-primary {
  background-color: #131313;
  color: white;
}

.events-btn-primary:hover {
  background-color: #ff9a24;
}

.events-btn-secondary {
  background-color: transparent;
  color: #131313;
  border: 2px solid #131313;
}

.events-btn-secondary:hover {
  background-color: #ff9a24;
  color: white;
  border: #ff9a24;
}

.events-btn-outline {
  background-color: transparent;
  color: #131313;
  border: 2px solid #131313;
}

.events-btn-outline:hover {
  background-color: #131313;
  color: white;
}

.events-btn-small {
  padding: 8px 16px;
  font-size: 14px;
}

.events-btn-large {
  padding: 15px 30px;
  font-size: 18px;
}

.events-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Contenedor principal */
.events-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Eventos Destacados */
.events-featured {
  padding: 80px 0;
  background-color: #f8f9fa;
}

.events-header {
  text-align: center;
  margin-bottom: 60px;
}

.events-header i {
  font-size: 56px;
  color: #ff9a24;
  margin-bottom: 20px;
}

.events-header h2 {
  font-size: 48px;
  font-weight: 800;
  color: #131313;
  margin-bottom: 16px;
}

.events-header p {
  font-size: 20px;
  color: #666;
}

.featured-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.featured-event-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.featured-event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.featured-event-card.highlighted {
  border: 3px solid #ff9a24;
}

.event-date {
  position: absolute;
  top: 20px;
  left: 20px;
  background: white;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  z-index: 2;
}

.event-day {
  font-size: 24px;
  font-weight: 800;
  color: #131313;
}

.event-month {
  font-size: 14px;
  font-weight: 600;
  color: #ff9a24;
  text-transform: uppercase;
}

.event-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-event-card:hover .event-image img {
  transform: scale(1.1);
}

.event-type-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.event-type-badge.adoption {
  background-color: #4ecdc4;
}

.event-type-badge.fundraising {
  background-color: #ff9a24;
}

.event-type-badge.volunteer {
  background-color: #45b7d1;
}

.event-type-badge.educational {
  background-color: #96ce45;
}

.event-content {
  padding: 25px;
}

.event-content h3 {
  font-size: 24px;
  font-weight: 700;
  color: #131313;
  margin-bottom: 15px;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.meta-item i {
  color: #ff9a24;
  width: 16px;
}

.event-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.event-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Todos los Eventos */
.events-all {
  padding: 80px 0;
  background: white;
}

.events-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
  flex-wrap: wrap;
  gap: 20px;
}

.events-filter h3 {
  font-size: 32px;
  font-weight: 700;
  color: #131313;
}

.filter-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  border: 2px solid #ddd;
  border-radius: 25px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.filter-btn.active,
.filter-btn:hover {
  border-color: #ff9a24;
  background: #ff9a24;
  color: white;
}

/* Timeline de Eventos */
.events-timeline {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.timeline-event {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 30px;
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
  transition: transform 0.3s ease;
}

.timeline-event:hover {
  transform: translateX(10px);
}

.timeline-date {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.timeline-day {
  font-size: 32px;
  font-weight: 800;
  color: #131313;
}

.timeline-month {
  font-size: 16px;
  font-weight: 600;
  color: #ff9a24;
  text-transform: uppercase;
}

.timeline-year {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.timeline-header h4 {
  font-size: 20px;
  font-weight: 700;
  color: #131313;
  margin: 0;
}

.event-category {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.event-category.adoption {
  background-color: #4ecdc4;
}

.event-category.fundraising {
  background-color: #ff9a24;
}

.event-category.volunteer {
  background-color: #45b7d1;
}

.event-category.educational {
  background-color: #96ce45;
}

.timeline-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.timeline-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

.timeline-meta i {
  color: #ff9a24;
}

.timeline-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.timeline-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Modal */
.event-modal {
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
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #131313;
  z-index: 10;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  padding: 30px;
}

.modal-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.modal-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #131313;
  margin: 0;
}

.event-category-large {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.event-category-large.adoption {
  background-color: #4ecdc4;
}

.event-category-large.fundraising {
  background-color: #ff9a24;
}

.event-category-large.volunteer {
  background-color: #45b7d1;
}

.event-category-large.educational {
  background-color: #96ce45;
}

.event-details {
  margin-bottom: 25px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-row i {
  color: #ff9a24;
  width: 20px;
  text-align: center;
}

.event-full-description {
  margin-bottom: 25px;
}

.event-full-description h4 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #131313;
}

.event-full-description p {
  line-height: 1.6;
  color: #666;
}

.event-requirements {
  margin-bottom: 30px;
}

.event-requirements h4 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #131313;
}

.event-requirements ul {
  list-style: none;
  padding: 0;
}

.event-requirements li {
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
  color: #666;
}

.event-requirements li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #ff9a24;
  font-weight: bold;
}

.modal-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

/* CTA Section */
.events-cta {
  padding: 80px 20px;
  background: linear-gradient(135deg, #131313 0%, #333 100%);
  text-align: center;
  color: white;
}

.cta-content h2 {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 20px;
  text-align: center;
}

.cta-content p {
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.9;
  text-align: center;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .events-hero-content h1 {
    font-size: 48px;
  }
  
  .events-hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .modal-grid {
    grid-template-columns: 1fr;
  }
  
  .events-filter {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .timeline-event {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .timeline-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .modal-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .featured-events-grid {
    grid-template-columns: 1fr;
  }
}

.cta-content {
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center;  
  text-align: center; 
  padding: 80px 20px;
}

.cta-content button {
  margin-top: 20px; 
}

</style>