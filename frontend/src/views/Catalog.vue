<template>
  <!-- Hero Section -->
  <section class="catalog-hero">
    <div class="catalog-hero-headlines">
      <h1>Encuentra tu compañero perfecto</h1>
      <p>Descubre a nuestros amigos peludos que buscan un hogar lleno de amor</p>
    </div>
    <div class="catalog-hero-buttons">
        <button class="catalog-btn catalog-btn-primary" @click="scrollToPets">
          Ver Mascotas
        </button>
        <button class="catalog-btn catalog-btn-secondary" @click="goToRequirements">
          Proceso de Adopción
        </button>
      </div>
  </section>

  <!-- Estados de carga y error -->
  <div v-if="loading" class="loading-state">
    <i class="fas fa-spinner fa-spin"></i> Cargando mascotas...
  </div>
  
  <div v-if="error" class="error-state">
    <i class="fas fa-exclamation-triangle"></i> {{ error }}
  </div>

  <!-- Filtros Section -->
  <div v-if="!loading && !error" class="filters-container">
    <h2>Filtrar por:</h2>
    <div class="filters-grid">
      <select v-model="filters.species" class="filter-select">
        <option value="">Todas las especies</option>
        <option value="Perro">Perros</option>
        <option value="Gato">Gatos</option>
        <option value="Conejo">Conejos</option>
        <option value="Ave">Aves</option>
        <option value="Otro">Otros</option>
      </select>
      
      <select v-model="filters.age" class="filter-select">
        <option value="">Todas las edades</option>
        <option v-for="ageOption in availableAges" :key="ageOption" :value="ageOption">
          {{ ageOption }}
        </option>
      </select>
      
      <select v-model="filters.size" class="filter-select">
        <option value="">Todos los tamaños</option>
        <option value="pequeño">Pequeño</option>
        <option value="mediano">Mediano</option>
        <option value="grande">Grande</option>
      </select>
      
      <button class="catalog-btn catalog-btn-outline" @click="clearFilters">
        Limpiar Filtros
      </button>
    </div>
  </div>

  <!-- Swiper de Mascotas -->
  <section v-if="!loading && !error" class="catalog-section" ref="petsSection">
    <div class="swiper catalog-swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="pet in filteredPets" :key="pet.id">
          <div class="swiper-slide-img">
            <img :src="pet.image" :alt="pet.name" />
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill"></path>
            </svg>
          </div>
          <div class="swiper-slide-content">
            <div>
              <h2>{{ pet.name }}</h2>
              <div class="pet-info">
                <span class="pet-badge pet-species">{{ getSpeciesText(pet.species) }}</span>
                <span class="pet-badge pet-age">{{ pet.age }}</span>
                <span class="pet-badge pet-size">{{ pet.size }}</span>
              </div>
              <p>{{ pet.description }}</p>
              <button class="show-more" @click="openPetDetails(pet)">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay mascotas -->
    <div v-if="filteredPets.length === 0" class="empty-catalog">
      <i class="fas fa-paw"></i>
      <h3>No hay mascotas disponibles en este momento</h3>
      <p>Pronto tendremos nuevos amigos esperando un hogar</p>
    </div>
  </section>

  <!-- Modal de Detalles -->
  <div v-if="selectedPet" class="pet-modal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">×</button>
      <div class="modal-grid">
        <div class="modal-image">
          <img :src="selectedPet.image" :alt="selectedPet.name" />
        </div>
        <div class="modal-info">
          <h2>{{ selectedPet.name }}</h2>
          <div class="pet-details">
            <div class="detail-item">
              <strong>Especie:</strong> {{ getSpeciesText(selectedPet.species) }}
            </div>
            <div class="detail-item">
              <strong>Raza:</strong> {{ selectedPet.breed }}
            </div>
            <div class="detail-item">
              <strong>Edad:</strong> {{ selectedPet.age }}
            </div>
            <div class="detail-item">
              <strong>Tamaño:</strong> {{ selectedPet.size }}
            </div>
            <div class="detail-item">
              <strong>Sexo:</strong> {{ selectedPet.gender === 'macho' ? 'Macho' : 'Hembra' }}
            </div>
            <div class="detail-item">
              <strong>Estado:</strong> 
              <span :class="['status-badge', selectedPet.status]">
                {{ getStatusText(selectedPet.status) }}
              </span>
            </div>
          </div>
          <p class="modal-description">{{ selectedPet.description }}</p>
          <button 
            class="catalog-btn catalog-btn-primary modal-adopt-btn" 
            @click="startAdoption(selectedPet)"
            :disabled="selectedPet.status !== 'disponible'"
          >
            {{ selectedPet.status === 'disponible' ? 'Iniciar Proceso de Adopción' : 'No Disponible' }}
          </button>
          <div v-if="selectedPet.status !== 'disponible'" class="adoption-status">
            <small>
              {{ selectedPet.status === 'en proceso' ? 'Esta mascota está en proceso de adopción' : 'Esta mascota ya fue adoptada' }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'

export default {
  name: 'Catalog',
  setup() {
    const router = useRouter()
    const petsSection = ref(null)
    const swiperInstance = ref(null)
    const selectedPet = ref(null)
    const loading = ref(false)
    const error = ref('')

    const API_BASE_URL = import.meta.env.VITE_API_URL

    const filters = ref({
      species: '',
      age: '',
      size: ''
    })

    // Mascotas desde la base de datos
    const pets = ref([])

    // Cargar mascotas desde la API
    const loadPets = async () => {
      try {
        loading.value = true
        error.value = ''
        
        console.log('Cargando mascotas para el catálogo...')
        const response = await fetch(`${API_BASE_URL}/pets`)
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()
        console.log('Mascotas recibidas:', data)

        if (data.success) {
          pets.value = data.pets.map(pet => ({
            id: pet._id || pet.id,
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            age: pet.age,
            size: pet.size,
            gender: pet.gender,
            description: pet.description,
            fullDescription: pet.description, 
            personality: 'Cariñoso y juguetón',
            status: pet.status,
            image: pet.image,
            createdAt: pet.createdAt
          }))
          console.log(` ${pets.value.length} mascotas cargadas en el catálogo`)
        } else {
          throw new Error(data.message || 'Error cargando mascotas')
        }
      } catch (err) {
        console.error('Error cargando mascotas:', err)
        error.value = 'No se pudieron cargar las mascotas. Intenta más tarde.'
      } finally {
        loading.value = false
      }
    }

    // Traducir especies
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

    // Traducir estados
    const getStatusText = (status) => {
      const statusMap = {
        'disponible': 'Disponible',
        'en proceso': 'En proceso',
        'adoptado': 'Adoptado'
      }
      return statusMap[status] || status
    }

    const availableAges = computed(() =>{
      const ages = pets.value
        .filter(pet => pet.status === 'disponible')
        .map(pet => pet.age)
        .filter(age => age && age.trim() !== '')

      return [...new Set(ages)].sort()
    })

    const filteredPets = computed(() => {
      return pets.value
        .filter(pet => pet.status === 'disponible')
        .filter(pet => {
          const speciesMatch = !filters.value.species || 
                            getSpeciesText(pet.species).toLowerCase() === filters.value.species.toLowerCase()
          
          const sizeMatch = !filters.value.size || 
                          pet.size.toLowerCase() === filters.value.size
          
          // FILTRAR POR EDAD EXACTA
          const ageMatch = !filters.value.age || 
                          pet.age === filters.value.age
          
          return speciesMatch && sizeMatch && ageMatch
        })
    })

    const initSwiper = () => {
      if (filteredPets.value.length > 0) {
        swiperInstance.value = new Swiper('.catalog-swiper', {
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5
          },
          keyboard: {
            enabled: true
          },
          mousewheel: {
            thresholdDelta: 70
          },
          spaceBetween: 30,
          loop: false,
          breakpoints: {
            640: {
              slidesPerView: 2
            },
            1024: {
              slidesPerView: 3
            }
          }
        })
      }
    }

    const scrollToPets = () => {
      petsSection.value?.scrollIntoView({ behavior: 'smooth' })
    }

    const openPetDetails = (pet) => {
      selectedPet.value = pet
    }

    const closeModal = () => {
      selectedPet.value = null
    }

    // FUNCIÓN MEJORADA - CON MANEJO DE AUTENTICACIÓN
    const startAdoption = (pet) => {
      if (pet.status === 'disponible') {
        const token = localStorage.getItem('auth_token')
        const petId = pet.id || pet._id
        
        console.log('Iniciando adopción para mascota:', petId)
        
        if (!token) {
          // Si no está logueado, ir a login con redirect
          console.log('Usuario no autenticado, redirigiendo a login')
          router.push(`/login?redirect=/adoption/${petId}`)
        } else {
          // Si está logueado, ir directo al formulario
          console.log('Usuario autenticado, redirigiendo a formulario')
          router.push(`/adoption/${petId}`)
        }
      } else {
        console.log('Mascota no disponible para adopción')
      }
    }

    const clearFilters = () => {
      filters.value = {
        species: '',
        age: '',
        size: ''
      }
    }

    const goToRequirements = () => {
      router.push('/adoption')
    }

    onMounted(async () => {
      await loadPets() 
      await nextTick()
      initSwiper()
    })

    watch(filteredPets, async () => {
      await nextTick()
      if (swiperInstance.value) {
        swiperInstance.value.destroy(true, true)
      }
      initSwiper()
    })

    onUnmounted(() => {
      if (swiperInstance.value) {
        swiperInstance.value.destroy()
      }
    })

    return {
      petsSection,
      filters,
      filteredPets,
      selectedPet,
      loading,
      error,
      availableAges,
      scrollToPets,
      openPetDetails,
      closeModal,
      startAdoption,
      clearFilters,
      goToRequirements,
      getSpeciesText,
      getStatusText
    }
  }
}
</script>


<style scoped>

.catalog-hero {
  min-width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 5vw, 5rem) clamp(1rem, 3vw, 3rem);
  box-sizing: border-box;
  flex-direction: column;
  text-align: center;
  background-image: url("img/hero-background-image.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding-top: 6.25rem;
  gap: 2.5rem;
}


.catalog-hero-headlines{
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: min(90%, 46.875rem);
  text-align: center;
  margin-bottom: 2.5rem;
}

.catalog-hero-headlines h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  color: #131313;
  margin-bottom: 1.75rem;
  line-height: 1.2;
}

.catalog-hero-headlines p {
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  font-weight: 600;
  color: #131313;
  line-height: 1.4;
}

.catalog-hero-buttons {
  display: flex;
  gap: clamp(1rem, 2vw, 1.5rem);
  margin-bottom: 3.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* Botones - Mejorado Responsivo */
.catalog-btn {
  min-width: clamp(12rem, 25vw, 14.6875rem);
  height: clamp(2.5rem, 6vh, 3.3125rem);
  font-size: clamp(1rem, 2vw, 1.5rem);
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-out;
  font-weight: 600;
  padding: 0.5rem 1rem;
  flex-shrink: 0;
}

.catalog-btn-primary {
  background-color: #131313;
  color: white;
}

.catalog-btn-primary:hover {
  background-color: #ff9a24;
}

.catalog-btn-secondary {
  background-color: transparent;
  color: #131313;
  border: 1px solid #131313;
}

.catalog-btn-secondary:hover {
  background-color: #ff9a24;
  color: white;
  border-color: #ff9a24;
}

.catalog-btn-outline {
  background-color: transparent;
  color: #131313;
  border: 2px solid #131313;
}

.catalog-btn-outline:hover {
  background-color: #131313;
  color: white;
}

/* Filtros - Mejorado Responsivo */
.filters-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 3.75rem) clamp(1rem, 3vw, 1.25rem);
}

.filters-container h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  margin-bottom: clamp(1.5rem, 4vw, 1.875rem);
  text-align: center;
  color: #131313;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
  gap: clamp(1rem, 3vw, 1.25rem);
  align-items: end;
}

.filter-select {
  padding: clamp(0.75rem, 2vw, 0.875rem) clamp(1rem, 2vw, 1rem);
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  background-color: white;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #ff9a24;
}

/* Swiper - Mejorado Responsivo (Colores Originales Mantenidos) */
.catalog-section{
  position: relative;
  width: min(90rem, 95%);
  margin: 0 auto;
  display: flex;
  align-items: center;
  min-height: 100vh;
  min-height: 100svh;
  gap: clamp(1rem, 3vw, 3rem);
  padding-block: min(20vh, 3rem);
}

.swiper.catalog-swiper {
  width: 100%;
  padding: clamp(1rem, 3vw, 1.875rem) 0;
}

.swiper-slide {
  width: min(18.75rem, 85vw);
  height: min(35rem, 80vh);
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: self-start;
  box-shadow: 0.063rem 0.5rem 1.25rem hsla(0, 0%, 0%, 0.1216);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.swiper-slide-img {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform: rotate(180deg);
  line-height: 0;
  bottom: -0.063rem;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.swiper-slide-img img {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  object-fit: cover;
  z-index: -1;
  transition: 0.3s ease-in-out;
  transform: rotate(-180deg);
}

.swiper-slide-img svg {
  position: relative;
  display: block;
  width: calc(300% + 1.3px);
  height: clamp(3rem, 8vw, 5rem);
  transform: rotateY(180deg);
}

.swiper-slide-img .shape-fill {
  fill: #ffffff;
}

.swiper-slide-content {
  background: #fff;
  padding: 0 clamp(1rem, 3vw, 1.65rem);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  width: 100%;
}

.swiper-slide-content > div {
  transform: translateY(-1.25rem);
}

.swiper-slide-content h2 {
  color: #000;
  font-family: "Raleway", sans-serif;
  font-weight: 700;
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  line-height: 1.4;
  margin-bottom: 0.425rem;
  text-transform: capitalize;
  letter-spacing: 0.02rem;
}

.swiper-slide-content p {
  color: #000;
  line-height: 1.6;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.swiper-slide-content .show-more {
  width: clamp(2.5rem, 6vw, 3.125rem);
  height: clamp(2.5rem, 6vw, 3.125rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #24aad9;
  border-radius: 50%;
  box-shadow: 0px 0.125rem 0.875rem rgba(36, 170, 217, 0.4196078431);
  margin-top: 1em;
  margin-bottom: 0.2em;
  opacity: 0;
  transition: opacity 0.3s ease-in;
  margin-left: auto;
  cursor: pointer;
}

.swiper-slide-content .show-more:hover {
  background: #1184ac;
}

.swiper-slide-content .show-more svg {
  width: clamp(1.25rem, 3vw, 1.75rem);
  color: #fff;
}

.swiper-slide-active:hover img {
  transform: scale(1.2) rotate(-185deg);
}

.swiper-slide-active:hover .show-more {
  opacity: 1;
}

.swiper-slide-active:hover p {
  display: block;
  overflow: visible;
}

.swiper-3d .swiper-slide-shadow-left,
.swiper-3d .swiper-slide-shadow-right {
  background-image: none;
}

.pet-info {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
  flex-wrap: wrap;
}

.pet-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: clamp(0.6rem, 1.5vw, 0.7rem);
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
}

.pet-species {
  background-color: #ff9a24;
  color: white;
}

.pet-age {
  background-color: #4ecdc4;
  color: white;
}

.pet-size {
  background-color: #45b7d1;
  color: white;
}

/* Modal - Mejorado Responsivo */
.pet-modal {
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
  padding: clamp(1rem, 3vw, 1.25rem);
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: min(900px, 95vw);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: clamp(0.5rem, 2vw, 0.9375rem);
  right: clamp(1rem, 3vw, 1.25rem);
  background: none;
  border: none;
  font-size: clamp(1.5rem, 4vw, 1.875rem);
  cursor: pointer;
  color: #131313;
  z-index: 10;
  width: clamp(2rem, 5vw, 2.5rem);
  height: clamp(2rem, 5vw, 2.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1rem, 3vw, 1.875rem);
  padding: clamp(1rem, 3vw, 1.875rem);
}

.modal-image img {
  width: 100%;
  height: min(400px, 50vh);
  object-fit: cover;
  border-radius: 10px;
}

.modal-info h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: clamp(1rem, 3vw, 1.25rem);
  color: #131313;
}

.pet-details {
  margin-bottom: clamp(1rem, 3vw, 1.25rem);
}

.detail-item {
  margin-bottom: clamp(0.5rem, 2vw, 0.625rem);
  font-size: clamp(0.9rem, 2vw, 1rem);
}

.modal-description {
  line-height: 1.6;
  margin-bottom: clamp(1.5rem, 4vw, 1.875rem);
  color: #666;
  font-size: clamp(0.9rem, 2vw, 1rem);
}

.modal-adopt-btn {
  width: 100%;
  padding: clamp(0.75rem, 2vw, 0.9375rem);
  font-size: clamp(1rem, 2.5vw, 1.1rem);
}

/* Media Queries Específicas */
@media screen and (max-width: 768px) {
  .catalog-hero-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
  
  .catalog-btn {
    width: 100%;
  }
  
  .modal-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .catalog-section {
    min-height: 80vh;
    padding-block: 2rem;
  }
}

@media screen and (max-width: 480px) {
  .catalog-hero {
    margin-top: 80px;
    min-height: 80vh;
    padding: 1.5rem 1rem;
  }
  
  .swiper-slide {
    width: 80vw;
    height: 75vh;
  }
  
  .modal-grid {
    padding: 1rem;
  }
  
  .pet-info {
    justify-content: center;
  }
}

@media screen and (min-width: 93.75rem) {
  .swiper.catalog-swiper {
    width: 85%;
  }
}

/* Soporte para dispositivos táctiles */
@media (hover: none) {
  .swiper-slide-content .show-more {
    opacity: 1;
  }
  
  .swiper-slide-content p {
    -webkit-line-clamp: 3;
  }
}

.loading-state, .error-state {
  padding: 2rem;
  text-align: center;
  margin: 1rem auto;
  border-radius: 8px;
  max-width: 600px;
}

.loading-state {
  background: #e3f2fd;
  color: #1976d2;
}

.error-state {
  background: #ffebee;
  color: #d32f2f;
}

.empty-catalog {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-catalog i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ccc;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.disponible {
  background: #d4edda;
  color: #155724;
}

.status-badge.en.proceso {
  background: #fff3cd;
  color: #856404;
}

.status-badge.adoptado {
  background: #f8d7da;
  color: #721c24;
}

.adoption-status {
  margin-top: 0.5rem;
  color: #666;
}

.modal-adopt-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.swiper-slide:hover img {
  transform: scale(1.2) rotate(-185deg);
}

.swiper-slide:hover .show-more {
  opacity: 1;
}

.swiper-slide:hover p {
  display: block;
  overflow: visible;
}

.swiper-slide {
  pointer-events: auto !important;
  z-index: 1;
}

.swiper-slide * {
  pointer-events: auto !important;
}

.swiper-slide-active {
  z-index: 10;
}

.catalog-swiper {
  pointer-events: auto !important;
}

.swiper-wrapper {
  pointer-events: auto !important;
}

.show-more {
  pointer-events: auto !important;
  cursor: pointer !important;
}
</style>