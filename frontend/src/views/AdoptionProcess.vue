<template>
    <br><br><br><br><br>
  <div class="adoption-process">
    <!-- Hero Section -->
    <div class="adoption-hero">
      <div class="hero-content">
        <h1>Encuentra a tu compañero perfecto</h1>
        <p>Comienza el viaje para darle un hogar lleno de amor a una mascota que te está esperando</p>
        <div class="hero-stats">
          <div class="stat">
            <span class="number">150+</span>
            <span class="label">Mascotas adoptadas</span>
          </div>
          <div class="stat">
            <span class="number">98%</span>
            <span class="label">Tasa de éxito</span>
          </div>
          <div class="stat">
            <span class="number">24/7</span>
            <span class="label">Soporte</span>
          </div>
        </div>
      </div>
      <div class="hero-image">
        <img src="/img/adoption-hero.jpg" alt="Familia con mascota" />
      </div>
    </div>

    <!-- Proceso de Adopción -->
    <div class="process-section">
      <div class="container">
        <h2>¿Cómo funciona el proceso de adopción?</h2>
        <p class="section-subtitle">Seguimos un proceso cuidadoso para asegurar que cada mascota encuentre el hogar perfecto</p>

        <div class="process-steps">
          <div class="step-card" v-for="step in processSteps" :key="step.id">
            <div class="step-number">{{ step.number }}</div>
            <div class="step-icon">
              <i :class="step.icon"></i>
            </div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
            <ul v-if="step.details" class="step-details">
              <li v-for="detail in step.details" :key="detail">{{ detail }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Requisitos -->
    <div class="requirements-section">
      <div class="container">
        <h2>Requisitos para adoptar</h2>
        <div class="requirements-grid">
          <div class="requirement-card">
            <div class="req-icon">
              <i class="fas fa-home"></i>
            </div>
            <h3>Vivienda adecuada</h3>
            <p>Espacio suficiente y seguro para la mascota, ya sea casa o departamento</p>
          </div>
          <div class="requirement-card">
            <div class="req-icon">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <h3>Estabilidad económica</h3>
            <p>Capacidad para cubrir gastos veterinarios, alimentación y cuidados</p>
          </div>
          <div class="requirement-card">
            <div class="req-icon">
              <i class="fas fa-clock"></i>
            </div>
            <h3>Tiempo y dedicación</h3>
            <p>Disponibilidad para paseos, juegos y atención diaria</p>
          </div>
          <div class="requirement-card">
            <div class="req-icon">
              <i class="fas fa-heart"></i>
            </div>
            <h3>Compromiso a largo plazo</h3>
            <p>Compromiso de cuidar a la mascota durante toda su vida</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mascotas Destacadas -->
    <div class="featured-pets" v-if="featuredPets.length > 0">
      <div class="container">
        <h2>Mascotas esperando por ti</h2>
        <div class="pets-grid">
          <div v-for="pet in featuredPets" :key="pet.id" class="pet-card">
            <img :src="pet.image" :alt="pet.name" class="pet-image">
            <div class="pet-info">
              <h3>{{ pet.name }}</h3>
              <p class="pet-breed">{{ pet.breed }}</p>
              <div class="pet-details">
                <span class="pet-age">{{ pet.age }}</span>
                <span class="pet-size">{{ getSizeText(pet.size) }}</span>
                <span class="pet-status" :class="pet.status">{{ getStatusText(pet.status) }}</span>
              </div>
              <p class="pet-description">{{ pet.description }}</p>
              <button class="btn-secondary" @click="selectPet(pet)">
                Seleccionar para adopción
              </button>
            </div>
          </div>
        </div>
        <div class="view-all">
          <button class="btn-primary" @click="$router.push('/catalog')">
            Ver todas las mascotas
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Formulario de Pre-Adopción -->
    <div class="pre-adoption-form" v-if="selectedPet">
      <div class="container">
        <div class="form-header">
          <h2>
            <span v-if="isPreSelectedFromCatalog" class="pre-selected-badge">
              <i class="fas fa-check"></i>
              Mascota pre-seleccionada
            </span>
            Solicitud de Adopción para {{ selectedPet.name }}
          </h2>
          

          <button 
            v-if="!isPreSelectedFromCatalog" 
            @click="deselectPet" 
            class="btn-change-pet-header"
          >
            <i class="fas fa-arrow-left"></i>
            Elegir otra mascota
          </button>
          
          <button 
            v-else 
            @click="$router.push('/catalog')" 
            class="btn-change-pet-header"
          >
            <i class="fas fa-arrow-left"></i>
            Volver al catálogo
          </button>
        </div>

        <form @submit.prevent="submitPreAdoption" class="adoption-form">
          <!-- Mascota Contexto -->
          <div class="form-section pet-context-section">
            <h3>Conoce a tu futuro compañero</h3>
            <div class="pet-context-card">
              <img :src="selectedPet.image" :alt="selectedPet.name" class="context-pet-image">
              <div class="context-pet-details">
                <h4>{{ selectedPet.name }}</h4>
                <div class="pet-specs">
                  <div class="spec-item">
                    <i class="fas fa-paw"></i>
                    <span><strong>Especie:</strong> {{ getSpeciesText(selectedPet.species) }}</span>
                  </div>
                  <div class="spec-item">
                    <i class="fas fa-birthday-cake"></i>
                    <span><strong>Edad:</strong> {{ selectedPet.age }}</span>
                  </div>
                  <div class="spec-item">
                    <i class="fas fa-ruler"></i>
                    <span><strong>Tamaño:</strong> {{ getSizeText(selectedPet.size) }}</span>
                  </div>
                  <div class="spec-item">
                    <i class="fas fa-venus-mars"></i>
                    <span><strong>Sexo:</strong> {{ getGenderText(selectedPet.gender) }}</span>
                  </div>
                  <div class="spec-item">
                    <i class="fas fa-dna"></i>
                    <span><strong>Raza:</strong> {{ selectedPet.breed }}</span>
                  </div>
                </div>
                <p class="pet-description">{{ selectedPet.description }}</p>
              </div>
            </div>
          </div>

          <!-- Información Personal -->
          <div class="form-section">
            <h3>Tu información personal</h3>
            <p class="section-subtitle">Necesitamos conocerte mejor para asegurar que {{ selectedPet.name }} tendrá el hogar perfecto</p>
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre completo *</label>
                <input type="text" v-model="form.personalInfo.fullName" required :disabled="submitting">
              </div>
              <div class="form-group">
                <label>Email *</label>
                <input type="email" v-model="form.personalInfo.email" required :disabled="submitting">
              </div>
              <div class="form-group">
                <label>Teléfono *</label>
                <input type="tel" v-model="form.personalInfo.phone" required :disabled="submitting">
              </div>
              <div class="form-group">
                <label>Fecha de nacimiento *</label>
                <input type="date" v-model="form.personalInfo.birthDate" required :disabled="submitting">
              </div>
            </div>
          </div>

          <!-- Situación Actual - Contextualizada -->
          <div class="form-section">
            <h3>Tu hogar y {{ selectedPet.name }}</h3>
            <p class="section-subtitle">Ayúdanos a entender cómo será la vida de {{ selectedPet.name }} en tu hogar</p>
            <div class="form-grid">
              <div class="form-group">
                <label>Tipo de vivienda *</label>
                <select v-model="form.housingInfo.housingType" required :disabled="submitting">
                  <option value="">Selecciona...</option>
                  <option value="house">Casa con patio</option>
                  <option value="apartment">Departamento</option>
                  <option value="townhouse">Casa sin patio</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div class="form-group">
                <label>¿Tienes espacio exterior? *</label>
                <select v-model="form.housingInfo.hasYard" required :disabled="submitting">
                  <option value="">Selecciona...</option>
                  <option value="yes">Sí, patio propio</option>
                  <option value="shared">Áreas comunes/parque cercano</option>
                  <option value="no">No tengo espacio exterior</option>
                </select>
              </div>
              <div class="form-group">
                <label>¿Con quién vives? *</label>
                <select v-model="form.housingInfo.livesWithOthers" required :disabled="submitting">
                  <option value="">Selecciona...</option>
                  <option value="alone">Vivo solo/a</option>
                  <option value="family">Con familia (incluye niños)</option>
                  <option value="roommates">Con roommates</option>
                </select>
              </div>
              <div class="form-group">
                <label>¿Todos en casa están de acuerdo con adoptar a {{ selectedPet.name }}? *</label>
                <select v-model="form.housingInfo.everyoneAgrees" required :disabled="submitting">
                  <option value="">Selecciona...</option>
                  <option value="yes">Sí, todos están emocionados</option>
                  <option value="some">La mayoría está de acuerdo</option>
                  <option value="no">Todavía no</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Experiencia con Mascotas -->
          <div class="form-section">
            <h3>Tu experiencia con mascotas</h3>
            <p class="section-subtitle">Comparte tu experiencia previa para ayudarnos a entender cómo cuidarás de {{ selectedPet.name }}</p>
            <div class="form-grid">
              <div class="form-group">
                <label>¿Has tenido mascotas antes? *</label>
                <select v-model="form.experience.hasPetsBefore" required :disabled="submitting" @change="togglePetHistory">
                  <option value="">Selecciona...</option>
                  <option value="yes">Sí, he tenido mascotas</option>
                  <option value="no">No, sería mi primera mascota</option>
                </select>
              </div>
              <div class="form-group">
                <label>¿Tienes otras mascotas actualmente? *</label>
                <select v-model="form.experience.hasCurrentPets" required :disabled="submitting">
                  <option value="">Selecciona...</option>
                  <option value="yes">Sí, tengo otras mascotas</option>
                  <option value="no">No, {{ selectedPet.name }} sería la única</option>
                </select>
              </div>
              <div v-if="showPetHistory" class="form-group full-width">
                <label>Cuéntanos sobre tus mascotas anteriores</label>
                <textarea v-model="form.experience.petHistory" rows="3" placeholder="Qué tipo de mascotas tuviste, por cuánto tiempo, qué aprendiste..." :disabled="submitting"></textarea>
              </div>
            </div>
          </div>

          <!-- Motivación y Cuidados - TOTALMENTE CONTEXTUALIZADO -->
          <div class="form-section">
            <h3>Tu plan para {{ selectedPet.name }}</h3>
            <p class="section-subtitle">Comparte tus planes específicos para el cuidado de {{ selectedPet.name }}</p>
            <div class="form-grid">
              <div class="form-group full-width">
                <label>¿Por qué quieres adoptar específicamente a {{ selectedPet.name }}? *</label>
                <textarea 
                  v-model="form.preferences.adoptionReason" 
                  rows="4" 
                  required 
                  :placeholder="`Qué fue lo que te conectó con ${selectedPet.name}? Por qué crees que ${getGenderText(selectedPet.gender) === 'Hembra' ? 'ella' : 'él'} es perfect${getGenderText(selectedPet.gender) === 'Hembra' ? 'a' : 'o'} para tu vida...`" 
                  :disabled="submitting"
                ></textarea>
              </div>
              <div class="form-group full-width">
                <label>Describe cómo será un día típico para {{ selectedPet.name }} en tu hogar *</label>
                <textarea 
                  v-model="form.preferences.carePlan" 
                  rows="4" 
                  required 
                  :placeholder="`Considerando que ${selectedPet.name} es ${selectedPet.age.toLowerCase()} y ${getSizeText(selectedPet.size).toLowerCase()}, describe rutina de paseos, alimentación, ejercicio, tiempo juntos...`" 
                  :disabled="submitting"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Compromisos ESPECÍFICOS -->
          <div class="commitment-section">
            <h3>Compromisos con {{ selectedPet.name }}</h3>
            <p class="section-subtitle">Al adoptar a {{ selectedPet.name }}, te comprometes a:</p>
            <div class="commitments-list">
              <div v-for="commitment in commitments" :key="commitment.id" class="commitment-item">
                <label class="commitment-checkbox">
                  <input 
                    type="checkbox" 
                    v-model="form.commitments[commitment.id]" 
                    required 
                    :disabled="submitting"
                  >
                  <span class="checkmark"></span>
                  <span class="commitment-text">{{ commitment.text }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Envío -->
          <div class="form-submit">
            <button 
              type="submit" 
              class="submit-btn" 
              :disabled="!isFormValid || submitting"
              :class="{ 'loading': submitting }"
            >
              <i class="fas" :class="submitting ? 'fa-spinner fa-spin' : 'fa-heart'"></i>
              {{ submitting ? 'Enviando solicitud...' : `Solicitar adopción de ${selectedPet.name}` }}
            </button>
            <p class="form-note">
              Al enviar esta solicitud, aceptas nuestro 
              <a href="#" @click.prevent="showTerms = true">proceso de adopción</a> 
              y te comprometes con el bienestar de {{ selectedPet.name }}.
            </p>
          </div>
        </form>
      </div>
    </div>

    <!-- Mensaje cuando no hay mascota seleccionada -->
    <div v-else class="no-pet-selected">
      <div class="container">
        <div class="no-pet-message">
          <i class="fas fa-paw"></i>
          <h2>Primero elige a tu futuro compañero</h2>
          <p>Selecciona una mascota de nuestra galería para comenzar el proceso de adopción.</p>
          <button class="btn-primary" @click="scrollToPets">
            Ver mascotas disponibles
            <i class="fas fa-arrow-down"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Términos -->
    <div v-if="showTerms" class="modal-overlay">
      <div class="modal">
        <h2>Términos del Proceso de Adopción</h2>
        <div class="terms-content">
          <h3>Nuestro compromiso con el bienestar animal</h3>
          <p>En Happy Critters, seguimos un proceso riguroso para asegurar que cada mascota encuentre un hogar amoroso y permanente.</p>
          
          <h4>Proceso de selección:</h4>
          <ul>
            <li>Revisión de solicitudes dentro de 24-48 horas</li>
            <li>Entrevista telefónica o virtual</li>
            <li>Verificación de referencias y vivienda</li>
            <li>Visita al hogar (cuando sea necesario)</li>
            <li>Conocimiento entre la mascota y la familia</li>
          </ul>

          <h4>Requisitos:</h4>
          <ul>
            <li>Mayor de 21 años</li>
            <li>Identificación oficial vigente</li>
            <li>Comprobante de domicilio</li>
            <li>Capacidad económica para cuidados veterinarios</li>
            <li>Acuerdo de todos los miembros del hogar</li>
          </ul>

          <p><strong>Tasa de adopción:</strong> $500 MXN que incluye vacunas, desparasitación, esterilización y microchip.</p>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" @click="showTerms = false">Entendido</button>
        </div>
      </div>
    </div>

    <!-- Modal Confirmación Mejorado con Gamificación -->
    <div v-if="showConfirmation" class="modal-overlay">
      <div class="modal success">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>¡Solicitud Enviada! 🎉</h2>
        
        <!-- Mostrar puntos ganados -->
        <div class="points-earned" v-if="confirmationData.pointsEarned > 0">
          <div class="points-badge">
            <i class="fas fa-star"></i>
            <span>+{{ confirmationData.pointsEarned }} puntos</span>
          </div>
          <p class="points-message">
            ¡Ganaste <strong>{{ confirmationData.pointsEarned }} puntos</strong> por enviar tu solicitud de adopción!
          </p>
        </div>

        <!-- Mostrar logro especial si es primera vez -->
        <div class="achievement-unlocked" v-if="confirmationData.achievement">
          <div class="achievement-badge">
            <i class="fas fa-trophy"></i>
            <span>Logro Desbloqueado</span>
          </div>
          <p class="achievement-message">
            <strong v-if="confirmationData.achievement === 'first_adoption_form'">
              ¡Primer Formulario Completado!
            </strong>
            <br>
            +50 puntos extra por tu primera solicitud de adopción
          </p>
        </div>

        <p><strong>Próximos pasos:</strong></p>
        <ol class="next-steps">
          <li>Revisión de tu solicitud (1-2 días)</li>
          <li>Entrevista telefónica</li>
          <li>Conocimiento con mascotas compatibles</li>
          <li>Proceso de adopción final</li>
        </ol>
        
        <div class="gamification-note">
          <small>
            💡 <strong>¡Gana 250 puntos más cuando completes la adopción!</strong><br>
            Y desbloquea el logro especial "Héroe de Mascotas"
          </small>
        </div>

        <div class="modal-actions">
          <button class="btn-primary" @click="closeConfirmation">Ver mis puntos</button>
          <button class="btn-secondary" @click="$router.push('/catalog')">
            Ver más mascotas
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Error -->
    <div v-if="showError" class="modal-overlay">
      <div class="modal error">
        <div class="error-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h2>Error al enviar solicitud</h2>
        <p>{{ errorMessage }}</p>
        <div class="modal-actions">
          <button class="btn-primary" @click="showError = false">Entendido</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { watch } from 'vue'

export default {
  name: 'AdoptionProcess',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const showTerms = ref(false)
    const showConfirmation = ref(false)
    const showError = ref(false)
    const showPetHistory = ref(false)
    const submitting = ref(false)
    const errorMessage = ref('')
    const petsFromUrl = ref([])

    const confirmationData = ref({
      pointsEarned: 0,
      achievement: null,
      isFirstApplication: false
    })

    const API_BASE_URL = import.meta.env.VITE_API_URL

    // Formulario actualizado para coincidir con el backend
    const form = reactive({
      selectedPetId: '',
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        birthDate: ''
      },
      housingInfo: {
        housingType: '',
        hasYard: '',
        livesWithOthers: '',
        everyoneAgrees: ''
      },
      experience: {
        hasPetsBefore: '',
        hasCurrentPets: '',
        petHistory: ''
      },
      preferences: {
        petType: '',
        preferredAge: 'any',
        preferredSize: 'any',
        adoptionReason: '',
        carePlan: ''
      },
      commitments: {}
    })

    // Cargar mascotas disponibles desde API
    const featuredPets = ref([])
    const loadingPets = ref(true)

    const loadAvailablePets = async () => {
      try {
        loadingPets.value = true
        const response = await fetch(`${API_BASE_URL}/pets?status=disponible&limit=6`)
        const data = await response.json()
        
        console.log('Respuesta de API de mascotas:', data)
        
        if (data.success) {
          // Asegurar que las mascotas tengan la estructura correcta
          featuredPets.value = (data.pets || []).map(pet => ({
            id: pet._id || pet.id, 
            _id: pet._id, 
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            age: pet.age,
            size: pet.size,
            gender: pet.gender,
            description: pet.description,
            status: pet.status,
            image: pet.image
          }))
          console.log('Mascotas procesadas:', featuredPets.value)
        } else {
          console.error('Error cargando mascotas:', data.message)
          featuredPets.value = []
        }
      } catch (error) {
        console.error('Error cargando mascotas:', error)
        featuredPets.value = []
      } finally {
        loadingPets.value = false
      }
    }

    // Helper functions
    const getSizeText = (size) => {
      const sizeMap = {
        'pequeño': 'Pequeño',
        'mediano': 'Mediano', 
        'grande': 'Grande'
      }
      return sizeMap[size] || size
    }

    const getStatusText = (status) => {
      const statusMap = {
        'disponible': 'Disponible',
        'en proceso': 'En proceso',
        'adoptado': 'Adoptado'
      }
      return statusMap[status] || status
    }

    const getGenderText = (gender) => {
      const genderMap = {
        'macho': 'Macho',
        'hembra': 'Hembra'
      }
      return genderMap[gender] || gender
    }

    const getSpeciesText = (species) => {
      const speciesMap = {
        'dog': 'Perro',
        'cat': 'Gato', 
        'rabbit': 'Conejo',
        'bird': 'Ave',
        'other': 'Otro'
      }
      return speciesMap[species] || species
    }

    const processSteps = ref([
      {
        id: 1,
        number: '01',
        icon: 'fas fa-search',
        title: 'Encuentra tu match',
        description: 'Explora nuestro catálogo y encuentra mascotas que se adapten a tu estilo de vida',
        details: [
          'Filtra por especie, edad y tamaño',
          'Lee historiales completos',
          'Guarda tus favoritos'
        ]
      },
      {
        id: 2,
        number: '02',
        icon: 'fas fa-file-alt',
        title: 'Solicitud inicial',
        description: 'Completa nuestro formulario de pre-adopción para conocerte mejor',
        details: [
          'Información personal y de vivienda',
          'Experiencia con mascotas',
          'Preferencias de adopción'
        ]
      },
      {
        id: 3,
        number: '03',
        icon: 'fas fa-comments',
        title: 'Entrevista y revisión',
        description: 'Charla con nuestro equipo para asegurar la compatibilidad',
        details: [
          'Entrevista telefónica o virtual',
          'Verificación de referencias',
          'Evaluación de compatibilidad'
        ]
      },
      {
        id: 4,
        number: '04',
        icon: 'fas fa-handshake',
        title: 'Conocimiento mutuo',
        description: 'Conoce a la mascota y asegúrate de que sea el match perfecto',
        details: [
          'Visita al refugio',
          'Paseo de prueba',
          'Interacción supervisada'
        ]
      },
      {
        id: 5,
        number: '05',
        icon: 'fas fa-home',
        title: 'Hogar forever',
        description: 'Completamos la adopción y te llevas a tu nuevo compañero a casa',
        details: [
          'Firma de contrato de adopción',
          'Orientación post-adopción',
          'Seguimiento y soporte continuo'
        ]
      }
    ])

    // Compromisos
    const commitments = ref([
      {
        id: 'vet_care',
        text: 'Me comprometo a proporcionar atención veterinaria regular y de emergencia'
      },
      {
        id: 'lifetime_care',
        text: 'Acepto cuidar de esta mascota por el resto de su vida'
      },
      {
        id: 'proper_identification',
        text: 'Mantendré la identificación y microchip actualizados'
      },
      {
        id: 'return_policy',
        text: 'En caso de no poder mantener a la mascota, la devolveré al refugio'
      },
      {
        id: 'home_visit',
        text: 'Autorizo visitas de seguimiento para verificar el bienestar de la mascota'
      }
    ])

    const selectedPet = computed(() => {
      console.log('Buscando mascota seleccionada...')
      console.log('form.selectedPetId:', form.selectedPetId)
      
      if (!form.selectedPetId) {
        console.log('No hay selectedPetId')
        return null
      }

      // Función helper para comparar IDs
      const findPetById = (petArray, arrayName) => {
        if (!petArray || petArray.length === 0) return null
        
        const found = petArray.find(pet => {
          const petId = pet._id || pet.id
          const match = petId === form.selectedPetId
          console.log(`Comparando en ${arrayName}:`, petId, 'vs', form.selectedPetId, '->', match)
          return match
        })
        
        if (found) {
          console.log(`Mascota encontrada en ${arrayName}:`, found.name)
        }
        return found
      }

      // Buscar en petsFromUrl primero
      const fromUrl = findPetById(petsFromUrl.value, 'petsFromUrl')
      if (fromUrl) return fromUrl

      // Buscar en featuredPets
      const fromFeatured = findPetById(featuredPets.value, 'featuredPets')
      if (fromFeatured) return fromFeatured

      console.log('Mascota no encontrada en ningún array')
      return null
    })

    // Computed property para verificar si viene del catálogo
    const isPreSelectedFromCatalog = computed(() => {
      return !!route.params.petId
    })

    // Computed property para validar formulario
    const isFormValid = computed(() => {
      console.log('Validando formulario...')
      
      // 1. Verificar que hay mascota seleccionada
      if (!form.selectedPetId || !selectedPet.value) {
        console.log('No hay mascota seleccionada')
        return false
      }

      // 2. Información personal
      const personalInfoValid = [
        form.personalInfo.fullName?.trim(),
        form.personalInfo.email?.trim(),
        form.personalInfo.phone?.trim(),
        form.personalInfo.birthDate?.trim()
      ].every(field => field && field !== '')
      
      if (!personalInfoValid) {
        console.log('Información personal incompleta')
        return false
      }

      // 3. Situación de vivienda
      const housingInfoValid = [
        form.housingInfo.housingType,
        form.housingInfo.hasYard,
        form.housingInfo.livesWithOthers,
        form.housingInfo.everyoneAgrees
      ].every(field => field && field !== '')
      
      if (!housingInfoValid) {
        console.log('Información de vivienda incompleta')
        return false
      }

      // 4. Experiencia con mascotas
      const experienceValid = [
        form.experience.hasPetsBefore,
        form.experience.hasCurrentPets
      ].every(field => field && field !== '')
      
      if (!experienceValid) {
        console.log('Experiencia con mascotas incompleta')
        return false
      }

      // 5. Razón de adopción
      const preferencesValid = form.preferences.adoptionReason?.trim()
      
      if (!preferencesValid) {
        console.log('Razón de adopción vacía')
        return false
      }

      // 6. Todos los compromisos aceptados
      const commitmentsValid = commitments.value.every(commitment => 
        form.commitments[commitment.id] === true
      )
      
      if (!commitmentsValid) {
        console.log('No todos los compromisos aceptados')
        return false
      }

      console.log('FORMULARIO VÁLIDO - Listo para enviar')
      return true
    })

    // Métodos
    const togglePetHistory = () => {
      showPetHistory.value = form.experience.hasPetsBefore === 'yes'
    }

    const selectPet = (pet) => {
      console.log('Seleccionando mascota:', pet)
      
      // Usar _id o id dependiendo de lo que venga de la API
      const petId = pet._id || pet.id
      console.log('ID de mascota encontrado:', petId)
      
      if (pet.status === 'disponible' && petId) {
        // Limpiar petsFromUrl cuando se selecciona manualmente
        petsFromUrl.value = []
        form.selectedPetId = petId
        console.log('selectedPetId establecido:', form.selectedPetId)
        
        // Scroll al formulario después de un pequeño delay para asegurar que el DOM se actualice
        setTimeout(() => {
          const formElement = document.querySelector('.pre-adoption-form')
          if (formElement) {
            formElement.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
            console.log('Scroll al formulario completado')
          } else {
            console.log('No se encontró el elemento del formulario')
          }
        }, 300)
      } else {
        console.log('Mascota no disponible para adopción o sin ID')
      }
    }

    const deselectPet = () => {
      console.log('Deseleccionando mascota')
      form.selectedPetId = ''
      petsFromUrl.value = []
    }

    const scrollToPets = () => {
      document.querySelector('.featured-pets')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }

    // Cargar mascota específica por ID
    const loadSpecificPet = async (petId) => {
      try {
        console.log('Cargando mascota específica:', petId)
        const response = await fetch(`${API_BASE_URL}/pets/${petId}`)
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
        
        const data = await response.json()
        
        console.log('Respuesta de API para mascota específica:', data)
        
        if (data.success && data.pet) {
          const petData = {
            id: data.pet._id || data.pet.id,
            name: data.pet.name,
            species: data.pet.species,
            breed: data.pet.breed,
            age: data.pet.age,
            size: data.pet.size,
            gender: data.pet.gender,
            description: data.pet.description,
            status: data.pet.status,
            image: data.pet.image
          }
          
          console.log('Datos de mascota procesados:', petData)
          
          // AGREGAR a petsFromUrl
          petsFromUrl.value = [petData]
          
          // Seleccionar automáticamente la mascota
          form.selectedPetId = petData.id
          console.log('Mascota pre-seleccionada:', petData.name)
          console.log('form.selectedPetId actualizado:', form.selectedPetId)
          
          return true
        } else {
          console.error('Error en respuesta de API:', data.message)
          return false
        }
      } catch (error) {
        console.error('Error cargando mascota específica:', error)
        return false
      }
    }

    // Verificar parámetros de URL INMEDIATAMENTE
    const checkUrlParameters = async () => {
      const petId = route.params.petId
      console.log('Parámetros de ruta:', route.params)
      console.log('petId desde URL:', petId)
      
      if (petId) {
        console.log('Mascota pre-seleccionada desde URL:', petId)
        // Cargar la mascota específica inmediatamente
        await loadSpecificPet(petId)
      } else {
        console.log('No hay mascota pre-seleccionada en URL')
      }
    }

    const submitPreAdoption = async () => {
      try {
        submitting.value = true
        
        const token = localStorage.getItem('auth_token')
        if (!token) {
          router.push('/login?redirect=/adoption-process')
          return
        }

        // Preparar datos para el backend
        const submissionData = {
          petId: form.selectedPetId,
          personalInfo: form.personalInfo,
          housingInfo: form.housingInfo,
          experience: form.experience,
          preferences: {
            adoptionReason: form.preferences.adoptionReason,
            carePlan: form.preferences.carePlan || ''
          },
          commitments: form.commitments
        }

        console.log('Enviando datos:', submissionData)
        
        const response = await fetch(`${API_BASE_URL}/adoptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(submissionData)
        })
      
        const data = await response.json()

        if (data.success) {
          // Guardar información para mostrar en el modal
          confirmationData.value = {
            pointsEarned: data.pointsEarned || 0,
            achievement: data.achievement || null,
            isFirstApplication: data.achievement === 'first_adoption_form'
          }
          
          showConfirmation.value = true
          resetForm()
        } else {
          throw new Error(data.message || 'Error al enviar solicitud')
        }
      } catch (error) {
        console.error('Error enviando solicitud:', error)
        errorMessage.value = error.message
        showError.value = true
      } finally {
        submitting.value = false
      }
    }

    const resetForm = () => {
      form.selectedPetId = ''
      Object.keys(form.personalInfo).forEach(key => {
        form.personalInfo[key] = ''
      })
      Object.keys(form.housingInfo).forEach(key => {
        form.housingInfo[key] = ''
      })
      Object.keys(form.experience).forEach(key => {
        form.experience[key] = ''
      })
      Object.keys(form.preferences).forEach(key => {
        if (key === 'preferredAge') form.preferences[key] = 'any'
        else if (key === 'preferredSize') form.preferences[key] = 'any'
        else form.preferences[key] = ''
      })
      Object.keys(form.commitments).forEach(key => {
        form.commitments[key] = false
      })
      showPetHistory.value = false
    }

    const closeConfirmation = () => {
      showConfirmation.value = false
      router.push('/userdashboard')
    }

    onMounted(async () => {
      // Inicializar compromisos
      commitments.value.forEach(commitment => {
        form.commitments[commitment.id] = false
      })

      //Verificar si hay mascota en URL (más importante)
      await checkUrlParameters()
      
      // 2. Cargar mascotas disponibles (en segundo plano)
      loadAvailablePets()
    })

    watch(selectedPet, (newPet) => {
      if (newPet && route.params.petId) {
        // Si hay una mascota seleccionada y viene de URL, hacer scroll al formulario
        setTimeout(() => {
          const formElement = document.querySelector('.pre-adoption-form')
          if (formElement) {
            formElement.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
          }
        }, 500)
      }
    })
        
    return {
      form,
      processSteps,
      commitments,
      featuredPets,
      loadingPets,
      showTerms,
      showConfirmation,
      showError,
      showPetHistory,
      submitting,
      errorMessage,
      confirmationData,
      isFormValid,
      selectedPet,
      isPreSelectedFromCatalog,   
      petsFromUrl, 
      checkUrlParameters,    
      loadAvailablePets,
      scrollToPets,       
      getSpeciesText,     
      getGenderText,      
      togglePetHistory,
      selectPet,
      deselectPet,
      submitPreAdoption,
      closeConfirmation,
      getSizeText,
      getStatusText
    }
  }
}
</script>
<style scoped>
.adoption-process {
  min-height: 100vh;
  background: #f8fafc;
}

/* Hero Section */
.adoption-hero {
  background: linear-gradient(135deg, #ff9a24 0%, #e03f3f 100%);
  color: white;
  padding: 100px 20px 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 20px 0;
  line-height: 1.1;
}

.hero-content p {
  font-size: 1.3rem;
  opacity: 0.9;
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  gap: 40px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.number {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
}

.label {
  font-size: 1rem;
  opacity: 0.8;
  margin-top: 8px;
}

.hero-image {
  text-align: center;
}

.hero-image img {
  max-width: 100%;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Process Section */
.process-section {
  padding: 100px 20px;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.process-section h2 {
  text-align: center;
  font-size: 2.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 20px 0;
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto 60px;
  line-height: 1.6;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.step-card {
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 2px solid #f7fafc;
  transition: all 0.3s ease;
  position: relative;
}

.step-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.step-number {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: #667eea;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
}

.step-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  color: white;
  font-size: 2rem;
}

.step-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 15px 0;
}

.step-card p {
  color: #718096;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.step-details {
  text-align: left;
  list-style: none;
  padding: 0;
  margin: 0;
}

.step-details li {
  padding: 8px 0;
  color: #4a5568;
  position: relative;
  padding-left: 20px;
}

.step-details li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #48bb78;
  font-weight: bold;
}

/* Requirements Section */
.requirements-section {
  padding: 100px 20px;
  background: #f7fafc;
}

.requirements-section h2 {
  text-align: center;
  font-size: 2.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 60px 0;
}

.requirements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.requirement-card {
  background: white;
  padding: 40px 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.requirement-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.req-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #ff9a24, #ff6b6b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 1.8rem;
}

.requirement-card h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 15px 0;
}

.requirement-card p {
  color: #718096;
  line-height: 1.6;
  margin: 0;
}

/* Pre-Adoption Form */
.pre-adoption-form {
  padding: 100px 20px;
  background: white;
}

.form-header {
  text-align: center;
  margin-bottom: 60px;
}

.form-header h2 {
  font-size: 2.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 15px 0;
}

.form-header p {
  font-size: 1.2rem;
  color: #718096;
  margin: 0;
}

.adoption-form {
  max-width: 1000px;
  margin: 0 auto;
}

.form-section {
  background: #f8fafc;
  padding: 40px;
  border-radius: 15px;
  margin-bottom: 30px;
  border-left: 4px solid #667eea;
}

.form-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 25px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-section h3:before {
  content: "•";
  color: #667eea;
  font-size: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Commitment Section */
.commitment-section {
  background: #fffaf0;
  padding: 40px;
  border-radius: 15px;
  margin-bottom: 30px;
  border-left: 4px solid #ff9a24;
}

.commitment-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 25px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.commitment-section h3:before {
  content: "🤝";
  font-size: 1.5rem;
}

.commitments-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.commitment-item {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #fed7d7;
}

.commitment-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  cursor: pointer;
  margin: 0;
}

.commitment-checkbox input {
  display: none;
}

.checkmark {
  width: 24px;
  height: 24px;
  border: 2px solid #e53e3e;
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.commitment-checkbox input:checked + .checkmark {
  background: #48bb78;
  border-color: #48bb78;
}

.commitment-checkbox input:checked + .checkmark:after {
  content: "✓";
  position: absolute;
  color: white;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.commitment-text {
  color: #2d3748;
  line-height: 1.5;
  font-weight: 500;
}

/* Form Submit */
.form-submit {
  text-align: center;
  padding: 40px 0;
}

.submit-btn {
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  border: none;
  padding: 20px 40px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(72, 187, 120, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(72, 187, 120, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.form-note {
  color: #718096;
  margin: 20px 0 0 0;
  font-size: 0.9rem;
}

.form-note a {
  color: #667eea;
  text-decoration: none;
}

.form-note a:hover {
  text-decoration: underline;
}

/* Featured Pets */
.featured-pets {
  padding: 100px 20px;
  background: #f7fafc;
}

.featured-pets h2 {
  text-align: center;
  font-size: 2.8rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 60px 0;
}

.pets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.pet-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.pet-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.pet-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.pet-info {
  padding: 25px;
}

.pet-info h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 5px 0;
}

.pet-breed {
  color: #667eea;
  font-weight: 600;
  margin: 0 0 15px 0;
}

.pet-details {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.pet-age, .pet-size {
  background: #f7fafc;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
}

.pet-description {
  color: #718096;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.view-all {
  text-align: center;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

/* Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  padding: 40px;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
}

.modal.success {
  text-align: center;
  max-width: 500px;
}

.success-icon {
  font-size: 4rem;
  color: #48bb78;
  margin-bottom: 20px;
}

.modal h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 20px 0;
}

.terms-content {
  color: #4a5568;
  line-height: 1.6;
}

.terms-content h3 {
  color: #2d3748;
  margin: 25px 0 15px 0;
}

.terms-content h4 {
  color: #2d3748;
  margin: 20px 0 10px 0;
}

.terms-content ul {
  margin: 0 0 20px 20px;
}

.terms-content li {
  margin-bottom: 8px;
}

.next-steps {
  text-align: left;
  margin: 20px 0;
  padding-left: 20px;
}

.next-steps li {
  margin-bottom: 10px;
  color: #4a5568;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

/* Responsive */
@media (max-width: 1024px) {
  .adoption-hero {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }
  
  .hero-content h1 {
    font-size: 3rem;
  }
  
  .process-steps {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .adoption-hero {
    padding: 80px 20px 60px;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    justify-content: center;
    flex-wrap: wrap;
    gap: 30px;
  }
  
  .process-steps,
  .requirements-grid {
    grid-template-columns: 1fr;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-section {
    padding: 30px 20px;
  }
  
  .pets-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1.1rem;
  }
  
  .process-section h2,
  .requirements-section h2,
  .featured-pets h2 {
    font-size: 2.2rem;
  }
  
  .step-card,
  .requirement-card {
    padding: 30px 20px;
  }
  
  .submit-btn {
    padding: 15px 30px;
    font-size: 1.1rem;
  }
}

/* Estilos para el nuevo diseño */
.form-header .btn-change-pet-header {
  background: #e2e8f0;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.form-header .btn-change-pet-header:hover {
  background: #cbd5e0;
}

.pet-context-section {
  background: #f7fafc;
  border-radius: 12px;
  padding: 2rem;
}

.pet-context-card {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.context-pet-image {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  border: 3px solid #4299e1;
}

.context-pet-details h4 {
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  color: #2d3748;
}

.pet-specs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
}

.spec-item i {
  color: #4299e1;
  width: 20px;
}

.section-subtitle {
  color: #718096;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.no-pet-selected {
  text-align: center;
  padding: 4rem 2rem;
}

.no-pet-message i {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.no-pet-message h2 {
  color: #4a5568;
  margin-bottom: 1rem;
}

.no-pet-message p {
  color: #718096;
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .pet-context-card {
    flex-direction: column;
    text-align: center;
  }
  
  .pet-specs {
    grid-template-columns: 1fr;
  }
}

/* Estilos para gamificación en adopciones */
.points-earned {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 10px;
  margin: 15px 0;
  text-align: center;
}

.points-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: bold;
}

.points-badge i {
  color: #FFD700;
}

.achievement-unlocked {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 15px;
  border-radius: 10px;
  margin: 15px 0;
  text-align: center;
}

.achievement-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: bold;
}

.achievement-badge i {
  color: #FFD700;
}

.gamification-note {
  background: #e8f5e8;
  border-left: 4px solid #4CAF50;
  padding: 10px 15px;
  margin: 15px 0;
  border-radius: 4px;
}

.points-message, .achievement-message {
  margin: 10px 0 0 0;
  font-size: 0.95em;
}
</style>