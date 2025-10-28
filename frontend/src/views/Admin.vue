<template>
  <div class="admin-dashboard">
    <!-- Header del Admin -->
    <div class="admin-header">
      <div class="admin-info">
        <h1>Panel de Administración</h1>
        <p>Gestiona mascotas, eventos y solicitudes de adopción</p>
      </div>
      <div class="admin-stats">
        <div class="stat-card">
          <i class="fas fa-paw"></i>
          <div class="stat-info">
            <span class="stat-number">{{ stats.totalPets }}</span>
            <span class="stat-label">Mascotas</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-calendar"></i>
          <div class="stat-info">
            <span class="stat-number">{{ stats.pendingApplications }}</span>
            <span class="stat-label">Solicitudes Pendientes</span>
          </div>
        </div>
        <div class="stat-card">
		  <i class="fas fa-users"></i>
		  <div class="stat-info">
			<span class="stat-number">{{ stats.totalParticipants }}</span>
			<span class="stat-label">Total de Asistentes Inscritos</span>
		  </div>
		</div>
      </div>
    </div>

    <!-- Navegación Admin -->
    <div class="admin-nav">
      <button 
        v-for="tab in adminTabs" 
        :key="tab.id"
        :class="['admin-tab', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <i :class="tab.icon"></i>
        {{ tab.name }}
        <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Contenido Dinámico -->
    <div class="admin-content">
      <!-- Gestión de Mascotas -->
      <div v-if="activeTab === 'pets'" class="tab-content">
        <div class="section-header">
          <h2>Gestión de Mascotas</h2>
          <button class="btn-primary" @click="showPetForm = true">
            <i class="fas fa-plus"></i> Añadir Mascota
          </button>
        </div>

        <!-- Filtros -->
        <div class="filters">
          <input 
            type="text" 
            v-model="petFilter" 
            placeholder="Buscar mascota..." 
            class="search-input"
          >
          <select v-model="statusFilter" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="adoptado">Adoptado</option>
            <option value="en proceso">En proceso</option>
          </select>
        </div>

        <!-- Tabla de Mascotas -->
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Mascota</th>
                <th>Especie</th>
                <th>Raza</th>
                <th>Edad</th>
                <th>Estado</th>
                <th>Fecha Ingreso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pet in filteredPets" :key="pet.id">
                <td class="pet-cell">
                  <img :src="pet.image" :alt="pet.name" class="pet-thumb">
                  <div class="pet-info">
                    <strong>{{ pet.name }}</strong>
                  </div>
                </td>
                <td>{{ getSpeciesText(pet.species) }}</td>
                <td>{{ pet.breed }}</td>
                <td>{{ pet.age }}</td>
                <td>
                  <span :class="['status-badge', pet.status]">
                    {{ getStatusText(pet.status) }}
                  </span>
                </td>
                <td>{{ formatDate(pet.createdAt) }}</td>
                <td class="actions">
                  <button @click="editPet(pet)" class="btn-icon" title="Editar">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deletePet(pet.id)" class="btn-icon delete" title="Eliminar">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Solicitudes de Adopción -->
      <div v-if="activeTab === 'applications'" class="tab-content">
        <div class="section-header">
          <h2>Solicitudes de Adopción</h2>
          <button class="btn-secondary" @click="loadApplications">
            <i class="fas fa-sync-alt"></i>
            Actualizar
          </button>
        </div>

        <div class="applications-grid">
          <div v-for="application in applications" :key="application._id || application.id" class="application-card">
            <div class="app-header">
              <div class="app-user">
                <img 
                  :src="application.userId?.profile?.avatar || application.user?.avatar || '/img/default-avatar.jpg'" 
                  :alt="application.personalInfo?.fullName || application.user?.name" 
                  class="user-avatar"
                >
                <div class="user-info">
                  <strong>{{ application.personalInfo?.fullName || application.user?.name }}</strong>
                  <span>{{ application.personalInfo?.email || application.user?.email }}</span>
                  <small>Solicitó: {{ new Date(application.appliedAt).toLocaleDateString('es-ES') }}</small>
                </div>
              </div>
              <span :class="['app-status', application.status]">
                {{ getAppStatusText(application.status) }}
              </span>
            </div>
            
            <div class="app-content">
              <div class="app-pet">
                <img 
                  :src="application.petId?.image || application.pet?.image" 
                  :alt="application.petId?.name || application.pet?.name" 
                  class="pet-thumb-sm"
                >
                <div>
                  <strong>{{ application.petId?.name || application.pet?.name }}</strong>
                  <span>{{ application.petId?.breed || application.pet?.breed }}</span>
                  <small>{{ getSpeciesText(application.petId?.species) }} • {{ application.petId?.age }}</small>
                </div>
              </div>
              <p class="app-reason">{{ application.preferences?.adoptionReason || application.reason }}</p>
            </div>

            <div class="app-actions">
              <button 
                v-if="application.status === 'pending'"
                @click="approveApplication(application._id || application.id)" 
                class="btn-success"
              >
                <i class="fas fa-check"></i>
                Aprobar
              </button>
              <button 
                v-if="application.status === 'pending'"
                @click="rejectApplication(application._id || application.id)" 
                class="btn-danger"
              >
                <i class="fas fa-times"></i>
                Rechazar
              </button>
              <button @click="viewApplication(application)" class="btn-primary">
                <i class="fas fa-eye"></i> Ver detalles
              </button>
            </div>
          </div>
        </div>

        <!-- Mensaje cuando no hay solicitudes -->
        <div v-if="applications.length === 0" class="no-data">
          <i class="fas fa-inbox"></i>
          <h3>No hay solicitudes de adopción</h3>
          <p>Las solicitudes aparecerán aquí cuando los usuarios las envíen.</p>
        </div>

        
      </div>

      <!-- Gestión de Eventos -->
      <div v-if="activeTab === 'events'" class="tab-content">
        <div class="section-header">
          <h2>Gestión de Eventos</h2>
          <button class="btn-primary" @click="showEventForm = true">
            <i class="fas fa-plus"></i> Crear Evento
          </button>
        </div>

        <div class="events-grid">
          <div v-for="event in events" :key="event.id" class="event-card">
            <img :src="event.image" :alt="event.title" class="event-image">
            <div class="event-content">
              <h3>{{ event.title }}</h3>
              <p class="event-description">{{ event.description }}</p>
              <div class="event-details">
                <div class="event-detail">
                  <i class="fas fa-calendar"></i>
                  <span>{{ event.day }} {{ event.month }} {{ event.year }}</span>
                </div>
                <div class="event-detail">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ event.location }}</span>
                </div>
                <div class="event-detail">
                  <i class="fas fa-users"></i>
                  <span>{{ event.participants }}/{{ event.capacity }} inscritos</span>
                </div>
              </div>
              <div class="event-actions">
                <button @click="editEvent(event)" class="btn-secondary">Editar</button>
                <button @click="deleteEvent(event.id)" class="btn-danger">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reportes -->
      <div v-if="activeTab === 'reports'" class="tab-content">
        <h2>Reportes y Estadísticas</h2>
        
        <!-- Filtros -->
        <div class="report-filters">
          <div class="filter-group">
            <label for="timeRange">Rango de Tiempo:</label>
            <select id="timeRange" v-model="reportFilters.timeRange" @change="loadReports">
              <option value="all">Todo el tiempo</option>
              <option value="6months">Últimos 6 meses</option>
              <option value="1year">Último año</option>
            </select>
          </div>
          <button class="btn-refresh" @click="loadReports">
            <i class="fas fa-sync-alt"></i>
            Actualizar Reportes
          </button>
        </div>

        <div class="reports-grid">
          <!-- Adopciones por Mes -->
          <div class="report-card">
            <div class="report-header">
              <h3>Adopciones por Mes</h3>
              <div class="report-stats">
                <span class="stat-total">Total: {{ totalAdoptions }}</span>
              </div>
            </div>
            <div class="chart-container">
              <div v-if="loadingReports.adoptions" class="chart-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Cargando datos...</p>
              </div>
              <div v-else-if="adoptionsByMonth.length === 0" class="chart-placeholder">
                <i class="fas fa-chart-bar"></i>
                <p>No hay datos de adopciones</p>
              </div>
              <div v-else class="chart-content">
                <div class="bar-chart">
                  <div 
                    v-for="item in adoptionsByMonth" 
                    :key="item.month"
                    class="bar-item"
                  >
                    <div class="bar-label">{{ item.month }}</div>
                    <div class="bar-track">
                      <div 
                        class="bar-fill" 
                        :style="{ height: calculateBarHeight(item.total) + '%' }"
                        :title="item.total + ' adopciones'"
                      ></div>
                    </div>
                    <div class="bar-value">{{ item.total }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Especies Más Populares -->
          <div class="report-card">
            <div class="report-header">
              <h3>Especies Más Populares</h3>
              <div class="report-stats">
                <span class="stat-total">Total: {{ totalSpecies }}</span>
              </div>
            </div>
            <div class="chart-container">
              <div v-if="loadingReports.species" class="chart-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Cargando datos...</p>
              </div>
              <div v-else-if="popularSpecies.length === 0" class="chart-placeholder">
                <i class="fas fa-chart-pie"></i>
                <p>No hay datos de especies</p>
              </div>
              <div v-else class="chart-content">
                <div class="pie-chart">
                  <div 
                    v-for="(item, index) in popularSpecies" 
                    :key="item.species"
                    class="pie-item"
                  >
                    <div class="pie-color" :style="{ backgroundColor: getSpeciesColor(index) }"></div>
                    <div class="pie-info">
                      <span class="pie-label">{{ getSpeciesText(item.species) }}</span>
                      <span class="pie-value">{{ item.total }} ({{ calculatePercentage(item.total) }}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>

    <!-- Modal Detalles de Solicitud -->
    <div v-if="showApplicationModal && selectedApplication" class="modal-overlay">
      <div class="modal large">
        <button class="modal-close" @click="closeApplicationModal">×</button>
        <div class="modal-header">
          <h2>Solicitud de Adopción</h2>
          <span :class="['application-status-badge', selectedApplication.status]">
            {{ getAppStatusText(selectedApplication.status) }}
          </span>
        </div>

        <div class="modal-content">
          <!-- Información del Solicitante -->
          <div class="detail-section">
            <h3>
              <i class="fas fa-user"></i>
              Información del Solicitante
            </h3>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Nombre completo:</label>
                <span>{{ selectedApplication.personalInfo?.fullName || selectedApplication.user?.name }}</span>
              </div>
              <div class="detail-item">
                <label>Email:</label>
                <span>{{ selectedApplication.personalInfo?.email || selectedApplication.user?.email }}</span>
              </div>
              <div class="detail-item">
                <label>Teléfono:</label>
                <span>{{ selectedApplication.personalInfo?.phone || 'No proporcionado' }}</span>
              </div>
              <div class="detail-item">
                <label>Fecha de nacimiento:</label>
                <span>{{ selectedApplication.personalInfo?.birthDate ? new Date(selectedApplication.personalInfo.birthDate).toLocaleDateString('es-ES') : 'No proporcionada' }}</span>
              </div>
            </div>
          </div>

          <!-- Información de la Mascota -->
          <div class="detail-section">
            <h3>
              <i class="fas fa-paw"></i>
              Mascota Solicitada
            </h3>
            <div class="pet-detail-card">
              <img 
                :src="selectedApplication.petId?.image || selectedApplication.pet?.image" 
                :alt="selectedApplication.petId?.name || selectedApplication.pet?.name" 
                class="pet-detail-image"
              >
              <div class="pet-detail-info">
                <h4>{{ selectedApplication.petId?.name || selectedApplication.pet?.name }}</h4>
                <div class="pet-specs">
                  <span class="pet-spec">
                    <i class="fas fa-dna"></i>
                    {{ selectedApplication.petId?.breed || selectedApplication.pet?.breed }}
                  </span>
                  <span class="pet-spec">
                    <i class="fas fa-birthday-cake"></i>
                    {{ selectedApplication.petId?.age || selectedApplication.pet?.age }}
                  </span>
                  <span class="pet-spec">
                    <i class="fas fa-ruler"></i>
                    {{ getSizeText(selectedApplication.petId?.size) }}
                  </span>
                  <span class="pet-spec">
                    <i class="fas fa-venus-mars"></i>
                    {{ getGenderText(selectedApplication.petId?.gender) }}
                  </span>
                </div>
                <p class="pet-description">{{ selectedApplication.petId?.description }}</p>
              </div>
            </div>
          </div>

          <!-- Situación de Vivienda -->
          <div class="detail-section">
            <h3>
              <i class="fas fa-home"></i>
              Situación de Vivienda
            </h3>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Tipo de vivienda:</label>
                <span>{{ getHousingTypeText(selectedApplication.housingInfo?.housingType) }}</span>
              </div>
              <div class="detail-item">
                <label>¿Tiene patio?:</label>
                <span>{{ getYardText(selectedApplication.housingInfo?.hasYard) }}</span>
              </div>
              <div class="detail-item">
                <label>¿Con quién vive?:</label>
                <span>{{ getLivingSituationText(selectedApplication.housingInfo?.livesWithOthers) }}</span>
              </div>
              <div class="detail-item">
                <label>¿Todos están de acuerdo?:</label>
                <span>{{ getAgreementText(selectedApplication.housingInfo?.everyoneAgrees) }}</span>
              </div>
            </div>
          </div>

          <!-- Experiencia con Mascotas -->
          <div class="detail-section">
            <h3>
              <i class="fas fa-heart"></i>
              Experiencia con Mascotas
            </h3>
            <div class="detail-grid">
              <div class="detail-item">
                <label>¿Ha tenido mascotas antes?:</label>
                <span>{{ selectedApplication.experience?.hasPetsBefore === 'yes' ? 'Sí' : 'No' }}</span>
              </div>
              <div class="detail-item">
                <label>¿Tiene mascotas actualmente?:</label>
                <span>{{ selectedApplication.experience?.hasCurrentPets === 'yes' ? 'Sí' : 'No' }}</span>
              </div>
            </div>
            <div v-if="selectedApplication.experience?.petHistory" class="detail-item full-width">
              <label>Experiencia previa:</label>
              <p class="history-text">{{ selectedApplication.experience.petHistory }}</p>
            </div>
          </div>

          <!-- Motivación y Plan de Cuidados -->
          <div class="detail-section">
            <h3>
              <i class="fas fa-star"></i>
              Motivación y Plan de Cuidados
            </h3>
            <div class="detail-item full-width">
              <label>¿Por qué quiere adoptar?</label>
              <p class="reason-text">{{ selectedApplication.preferences?.adoptionReason || selectedApplication.reason }}</p>
            </div>
            <div v-if="selectedApplication.preferences?.carePlan" class="detail-item full-width">
              <label>Plan de cuidados:</label>
              <p class="careplan-text">{{ selectedApplication.preferences.carePlan }}</p>
            </div>
          </div>

          <!-- Compromisos Aceptados -->
          <div class="detail-section">
            <h3>
              <i class="fas fa-handshake"></i>
              Compromisos Aceptados
            </h3>
            <div class="commitments-list">
              <div 
                v-for="commitment in commitments" 
                :key="commitment.id"
                class="commitment-detail-item"
                :class="{ 'accepted': selectedApplication.commitments?.[commitment.id] }"
              >
                <i class="fas" :class="selectedApplication.commitments?.[commitment.id] ? 'fa-check-circle' : 'fa-times-circle'"></i>
                <span>{{ commitment.text }}</span>
              </div>
            </div>
          </div>

          <!-- Metadatos -->
          <div class="detail-section">
            <h3>
              <i class="fas fa-info-circle"></i>
              Información de la Solicitud
            </h3>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Fecha de solicitud:</label>
                <span>{{ new Date(selectedApplication.appliedAt).toLocaleDateString('es-ES') }}</span>
              </div>
              <div class="detail-item">
                <label>Hora de solicitud:</label>
                <span>{{ new Date(selectedApplication.appliedAt).toLocaleTimeString('es-ES') }}</span>
              </div>
              <div class="detail-item">
                <label>ID de solicitud:</label>
                <span class="application-id">{{ selectedApplication._id || selectedApplication.id }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="modal-actions" v-if="selectedApplication.status === 'pending'">
          <button @click="rejectApplication(selectedApplication._id || selectedApplication.id)" class="btn-danger">
            <i class="fas fa-times"></i>
            Rechazar Solicitud
          </button>
          <button @click="approveApplication(selectedApplication._id || selectedApplication.id)" class="btn-success">
            <i class="fas fa-check"></i>
            Aprobar Solicitud
          </button>
        </div>
        <div class="modal-actions" v-else>
          <button @click="closeApplicationModal" class="btn-primary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal Añadir/Editar Mascota -->
    <div v-if="showPetForm" class="modal-overlay">
      <div class="modal large">
        <h2>{{ editingPet ? 'Editar Mascota' : 'Añadir Nueva Mascota' }}</h2>
        <form @submit.prevent="savePet">
          <div class="form-grid">
            <!-- Imagen y análisis -->
            <div class="form-group full-width">
              <label>Imagen URL *</label>
              <div class="image-input-group">
                <input type="url" v-model="petForm.image" placeholder="https://..." @blur="onImageUrlChange" required>
                <button 
                  type="button" 
                  @click="analyzeImage" 
                  class="btn-analysis"
                  :disabled="!petForm.image || analyzingImage"
                >
                  <i class="fas fa-magic"></i>
                  {{ analyzingImage ? 'Analizando...' : 'Analizar Imagen' }}
                </button>
              </div>
            </div>

            <!-- Panel de sugerencias automáticas -->
            <div v-if="imageSuggestions.show" class="suggestions-panel">
              <h3>Sugerencias Automáticas</h3>
              <div class="suggestions-grid">
                <div class="suggestion-item">
                  <label>Especie detectada:</label>
                  <span class="suggestion-value">{{ imageSuggestions.species || 'No detectada' }}</span>
                  <button 
                    v-if="imageSuggestions.species"
                    @click="applySuggestion('species', imageSuggestions.species)"
                    class="btn-suggestion"
                  >
                    Usar
                  </button>
                </div>
                <div class="suggestion-item">
                  <label>Raza detectada:</label>
                  <span class="suggestion-value">{{ imageSuggestions.breed || 'No detectada' }}</span>
                  <button 
                    v-if="imageSuggestions.breed"
                    @click="applySuggestion('breed', imageSuggestions.breed)"
                    class="btn-suggestion"
                  >
                    Usar
                  </button>
                </div>
                <div class="suggestion-item">
                  <label>Confianza:</label>
                  <span class="suggestion-confidence">{{ imageSuggestions.confidence }}%</span>
                </div>
              </div>
              <div v-if="imageSuggestions.appearance.length" class="appearance-suggestions">
                <label>Atributos detectados:</label>
                <div class="appearance-tags">
                  <span 
                    v-for="attr in imageSuggestions.appearance" 
                    :key="attr"
                    class="appearance-tag"
                  >
                    {{ attr }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Campos del formulario CORREGIDOS -->
            <div class="form-group">
              <label>Nombre *</label>
              <input type="text" v-model="petForm.name" required>
            </div>
            
            <div class="form-group">
              <label>Especie *</label>
              <select v-model="petForm.species" required>
                <option value="dog">Perro</option>
                <option value="cat">Gato</option>
                <option value="rabbit">Conejo</option>
                <option value="bird">Ave</option>
                <option value="other">Otro</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Raza *</label>
              <input type="text" v-model="petForm.breed" required>
            </div>
            
            <div class="form-group">
              <label>Edad *</label>
              <input type="text" v-model="petForm.age" placeholder="Ej: 2 años, 6 meses" required>
            </div>
            
            <div class="form-group">
              <label>Sexo *</label>
              <select v-model="petForm.gender" required>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Tamaño *</label>
              <select v-model="petForm.size" required>
                <option value="pequeño">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </select>
            </div>
            
            <div class="form-group full-width">
              <label>Descripción *</label>
              <textarea v-model="petForm.description" rows="3" required></textarea>
            </div>
            
            <div class="form-group">
              <label>Estado</label>
              <select v-model="petForm.status">
                <option value="disponible">Disponible</option>
                <option value="en proceso">En proceso</option>
                <option value="adoptado">Adoptado</option>
              </select>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closePetForm" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary" :disabled="savingPet">
              {{ savingPet ? 'Guardando...' : (editingPet ? 'Actualizar' : 'Guardar') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Crear/Editar Evento -->
    <div v-if="showEventForm" class="modal-overlay">
      <div class="modal large">
        <h2>{{ editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento' }}</h2>
        <form @submit.prevent="saveEvent">
          <div class="form-grid">
            <!-- Información Básica -->
            <div class="form-group full-width">
              <label>Título del Evento *</label>
              <input type="text" v-model="eventForm.title" required>
            </div>
            
            <div class="form-group">
              <label>Tipo de Evento *</label>
              <select v-model="eventForm.type" required @change="updateTypeText">
                <option value="">Seleccionar tipo</option>
                <option value="adoption">Feria de Adopción</option>
                <option value="fundraising">Recaudación de Fondos</option>
                <option value="volunteer">Voluntariado</option>
                <option value="educational">Charla Educativa</option>
                <option value="workshop">Taller</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Tipo de Evento (Texto)</label>
              <input type="text" v-model="eventForm.typeText" readonly>
            </div>

            <!-- Fecha y Hora -->
            <div class="form-group">
              <label>Fecha *</label>
              <input type="date" v-model="eventForm.date" required>
            </div>
            
            <div class="form-group">
              <label>Hora *</label>
              <input type="time" v-model="eventForm.time" required>
            </div>

            <!-- Ubicación y Capacidad -->
            <div class="form-group full-width">
              <label>Ubicación *</label>
              <input type="text" v-model="eventForm.location" required>
            </div>
            
            <div class="form-group">
              <label>Capacidad Máxima *</label>
              <input type="number" v-model="eventForm.capacity" min="1" required>
            </div>

            <!-- Imagen y Organizador -->
            <div class="form-group full-width">
              <label>Imagen URL *</label>
              <input type="url" v-model="eventForm.image" required placeholder="https://ejemplo.com/imagen.jpg">
              <small>Usa una imagen de buena calidad para el evento</small>
            </div>
            
            <div class="form-group full-width">
              <label>Organizador *</label>
              <input type="text" v-model="eventForm.organizer" required>
            </div>

            <!-- Descripciones -->
            <div class="form-group full-width">
              <label>Descripción Corta *</label>
              <textarea v-model="eventForm.description" rows="3" required placeholder="Descripción breve que aparece en las tarjetas"></textarea>
            </div>
            
            <div class="form-group full-width">
              <label>Descripción Completa *</label>
              <textarea v-model="eventForm.fullDescription" rows="5" required placeholder="Descripción detallada para el modal del evento"></textarea>
            </div>

            <!-- Configuraciones Adicionales -->
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="eventForm.highlighted">
                <span class="checkmark"></span>
                ¿Destacar este evento?
              </label>
              <small>Aparecerá en la sección de eventos destacados</small>
            </div>

            <div class="form-group">
              <label>Estado</label>
              <select v-model="eventForm.status">
                <option value="active">Activo</option>
                <option value="cancelled">Cancelado</option>
                <option value="completed">Completado</option>
              </select>
            </div>

            <!-- Requisitos (Array) -->
            <div class="form-group full-width">
              <label>Requisitos para Participar</label>
              <div class="requirements-input">
                <div v-for="(requirement, index) in eventForm.requirements" :key="index" class="requirement-item">
                  <input 
                    type="text" 
                    v-model="eventForm.requirements[index]" 
                    placeholder="Ej: Mayor de 18 años"
                  >
                  <button type="button" @click="removeRequirement(index)" class="btn-remove">
                    ×
                  </button>
                </div>
                <button type="button" @click="addRequirement" class="btn-add">
                  + Agregar Requisito
                </button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeEventForm" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ editingEvent ? 'Actualizar Evento' : 'Crear Evento' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'

export default {
  name: 'AdminPanel',
  setup() {
    const activeTab = ref('pets')
    const showPetForm = ref(false)
    const showEventForm = ref(false)
    const editingPet = ref(null)
    const editingEvent = ref(null)
    const petFilter = ref('')
    const statusFilter = ref('')
    const savingPet = ref(false)

    // VARIABLES PARA ANÁLISIS
    const analyzingImage = ref(false)
    const imageSuggestions = reactive({
      show: false,
      species: '',
      breed: '',
      confidence: 0,
      appearance: []
    })

    // VARIABLES PARA REPORTES
    const adoptionsByMonth = ref([])
    const popularSpecies = ref([])
    const loadingReports = ref({
      adoptions: false,
      species: false
    })
    const reportFilters = ref({
      timeRange: 'all'
    })
    
    // VARIABLE DE ENTORNO PARA API
    const API_BASE_URL = import.meta.env.VITE_API_URL

    // Estadísticas
    const stats = reactive({
      totalPets: 0,
      pendingApplications: 0,
      upcomingEvents: 0,
	  totalParticipants: 0
    })

    // Navegación 
    const adminTabs = computed(() => [
      { id: 'pets', name: 'Mascotas', icon: 'fas fa-paw', count: stats.totalPets },
      { id: 'applications', name: 'Solicitudes', icon: 'fas fa-file-alt', count: stats.pendingApplications },
      { id: 'events', name: 'Eventos', icon: 'fas fa-calendar', count: events.value.length },
      { id: 'reports', name: 'Reportes', icon: 'fas fa-chart-bar' }
    ])

    // Datos reactivos
    const pets = ref([])
    const events = ref([]) 
    const applications = ref([
      {
        id: 1,
        user: {
          name: 'Ana García',
          email: 'ana@email.com',
          avatar: '/img/avatars/user1.jpg'
        },
        pet: {
          name: 'Max',
          breed: 'Labrador',
          image: '/img/pets/dog1.jpg'
        },
        reason: 'Tengo un jardín grande y experiencia con perros grandes.',
        status: 'pending',
        appliedAt: '2024-01-25'
      }
    ])

    // Formularios
    const petForm = reactive({
      name: '',
      species: 'dog',
      breed: '',
      age: '',
      gender: 'macho',
      size: 'mediano',
      description: '',
      status: 'disponible',
      image: ''
    })

    const eventForm = reactive({
        title: '',
        description: '',
        fullDescription: '',
        type: 'adoption',
        typeText: 'Feria de Adopción',
        date: '',
        time: '',
        location: '',
        image: '',
        capacity: 50,
        organizer: 'Huellitas con Corazón',
        highlighted: false,
        requirements: [],
        status: 'active'
    })

    // Cargar mascotas desde API
    const loadPets = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        console.log('Cargando mascotas...', token ? 'Token presente' : 'Sin token')
        
        const response = await fetch(`${API_BASE_URL}/admin/pets`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
          pets.value = data.pets
          stats.totalPets = data.pets.length
          console.log('Mascotas cargadas:', data.pets.length)
        } else {
          console.error('Error en respuesta:', data.message)
        }
      } catch (error) {
        console.error('Error cargando mascotas:', error)
        // Datos de ejemplo para desarrollo
        pets.value = [
          {
            id: 1,
            name: 'Max',
            species: 'dog',
            breed: 'Labrador',
            age: '2 años',
            status: 'disponible',
            image: '/img/pets/dog1.jpg',
            createdAt: new Date().toISOString()
          }
        ]
        stats.totalPets = pets.value.length
      }
    }

    // Cargar eventos desde API
    const loadEvents = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        console.log('AdminPanel: Cargando eventos...')
        
        const response = await fetch(`${API_BASE_URL}/events`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('AdminPanel - Eventos recibidos:', data.events)
        
        if (data.success) {
          events.value = data.events
          
          stats.upcomingEvents = data.events.filter(event => 
            new Date(event.date) > new Date()
          ).length

          stats.totalParticipants = data.events.reduce((total, event) => {
            return total + event.participants
          }, 0)
          
          console.log('AdminPanel - Eventos cargados:', events.value.length)
          console.log('Primer evento - campos de fecha:', {
            day: events.value[0]?.day,
            month: events.value[0]?.month,
            year: events.value[0]?.year,
            fullDate: events.value[0]?.fullDate
          })
        } else {
          console.error('Error en respuesta eventos:', data.message)
        }
      } catch (error) {
        console.error('Error cargando eventos:', error)
        events.value = []
      }
    }

    // Computed
    const filteredPets = computed(() => {
      return pets.value.filter(pet => {
        const matchesSearch = pet.name.toLowerCase().includes(petFilter.value.toLowerCase()) ||
                            pet.breed.toLowerCase().includes(petFilter.value.toLowerCase())
        const matchesStatus = !statusFilter.value || pet.status === statusFilter.value
        return matchesSearch && matchesStatus
      })
    })

    // Métodos para mascotas
    const getSpeciesText = (species) => {
      const speciesMap = { 
        dog: 'Perro', 
        cat: 'Gato', 
        rabbit: 'Conejo',
        bird: 'Ave',
        other: 'Otro' 
      }
      return speciesMap[species] || species
    }

    const getStatusText = (status) => {
      const statusMap = {
        disponible: 'Disponible',
        'en proceso': 'En proceso',
        adoptado: 'Adoptado'
      }
      return statusMap[status] || status
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('es-ES')
    }

    const editPet = (pet) => {
      editingPet.value = pet.id
      Object.assign(petForm, pet)
      showPetForm.value = true
    }

    const savePet = async () => {
      try {
        savingPet.value = true
        const token = localStorage.getItem('auth_token')
        
        const petData = {
          name: petForm.name,
          species: petForm.species,
          breed: petForm.breed,
          age: petForm.age,
          gender: petForm.gender,
          size: petForm.size,
          description: petForm.description,
          status: petForm.status,
          image: petForm.image
        }

        const url = editingPet.value 
          ? `${API_BASE_URL}/admin/pets/${editingPet.value}`
          : `${API_BASE_URL}/admin/pets`
          
        const method = editingPet.value ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(petData)
        })

        const data = await response.json()

        if (data.success) {
          await loadPets()
          closePetForm()
          alert(data.message)
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error('Error guardando mascota:', error)
        alert(error.message || 'Error guardando mascota')
      } finally {
        savingPet.value = false
      }
    }

    const deletePet = async (id) => {
      if (!confirm('¿Estás seguro de que quieres eliminar esta mascota?')) return
      
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${API_BASE_URL}/admin/pets/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (data.success) {
          await loadPets()
          alert(data.message)
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error('Error eliminando mascota:', error)
        alert(error.message || 'Error eliminando mascota')
      }
    }

    // Métodos para análisis de imagen
    const analyzeImage = async () => {
      if (!petForm.image) return
      
      try {
        analyzingImage.value = true
        const token = localStorage.getItem('auth_token')
        
        const response = await fetch(`${API_BASE_URL}/admin/analyze-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ imageUrl: petForm.image })
        })

        const data = await response.json()

        if (data.success) {
          imageSuggestions.show = true
          imageSuggestions.species = data.suggestions.species
          imageSuggestions.breed = data.suggestions.breed
          imageSuggestions.confidence = data.suggestions.confidence
          imageSuggestions.appearance = data.suggestions.appearance || []
        } else {
          alert('Error analizando imagen: ' + data.message)
        }
      } catch (error) {
        console.error('Error analizando imagen:', error)
        alert('Error conectando con el servicio de análisis')
      } finally {
        analyzingImage.value = false
      }
    }

    const applySuggestion = (field, value) => {
      if (field === 'species') {
        const speciesMap = {
          'Perro': 'dog',
          'Gato': 'cat',
          'Conejo': 'rabbit',
          'Ave': 'bird'
        }
        petForm.species = speciesMap[value] || 'other'
      } else if (field === 'breed') {
        petForm.breed = value
      }
    }

    const onImageUrlChange = () => {
      imageSuggestions.show = false
    }

    const closePetForm = () => {
      showPetForm.value = false
      editingPet.value = null
      resetImageSuggestions()
      resetPetForm()
    }

    const resetImageSuggestions = () => {
      imageSuggestions.show = false
      imageSuggestions.species = ''
      imageSuggestions.breed = ''
      imageSuggestions.confidence = 0
      imageSuggestions.appearance = []
    }

    const resetPetForm = () => {
      Object.assign(petForm, {
        name: '',
        species: 'dog',
        breed: '',
        age: '',
        gender: 'macho',
        size: 'mediano',
        description: '',
        status: 'disponible',
        image: ''
      })
    }

    // Métodos para eventos
    const getTypeText = (type) => {
      const typeMap = {
        adoption: 'Feria de Adopción',
        fundraising: 'Recaudación de Fondos',
        volunteer: 'Voluntariado',
        educational: 'Charla Educativa'
      }
      return typeMap[type] || type
    }

    const formatEventDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('es-ES')
    }

    const saveEvent = async () => {
    try {
        const token = localStorage.getItem('auth_token')
        const eventData = formatEventForAPI(eventForm)

        const url = editingEvent.value 
        ? `${API_BASE_URL}/events/${editingEvent.value}`
        : `${API_BASE_URL}/events`
        
        const method = editingEvent.value ? 'PUT' : 'POST'

        console.log('Enviando datos de evento:', eventData)

        const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
        })

        const data = await response.json()

        if (data.success) {
        await loadEvents()
        closeEventForm()
        alert(data.message)
        } else {
        throw new Error(data.message)
        }
    } catch (error) {
        console.error('Error guardando evento:', error)
        alert(error.message || 'Error guardando evento')
    }
    }

    const deleteEvent = async (id) => {
      if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) return
      
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (data.success) {
          await loadEvents()
          alert(data.message)
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error('Error eliminando evento:', error)
        alert(error.message || 'Error eliminando evento')
      }
    }

    const editEvent = (event) => {
      editingEvent.value = event.id
      
      // COPIAR TODOS LOS CAMPOS DEL EVENTO CON MANEJO DE FECHA MEJORADO
      Object.assign(eventForm, {
        title: event.title,
        description: event.description,
        fullDescription: event.fullDescription || event.description,
        type: event.type,
        typeText: event.typeText,
        // Mostrar la fecha local correcta al editar
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        time: event.time || '',
        location: event.location,
        image: event.image,
        capacity: event.capacity || 50,
        organizer: event.organizer || 'Huellitas con Corazón',
        highlighted: event.highlighted || false,
        requirements: event.requirements || [],
        status: event.status || 'active'
      })
      
      console.log('Editando evento - fecha:', {
        fechaOriginal: event.date,
        fechaFormulario: eventForm.date
      })
      
      showEventForm.value = true
    }

    const closeEventForm = () => {
      showEventForm.value = false
      editingEvent.value = null
      resetEventForm()
    }

    const resetEventForm = () => {
      Object.assign(eventForm, {
        title: '',
        description: '',
        fullDescription: '',
        type: 'adoption',
        typeText: 'Feria de Adopción',
        date: '',
        time: '',
        location: '',
        image: '',
        capacity: 50,
        organizer: 'Huellitas con Corazón',
        highlighted: false,
        requirements: []
      })
    }

    // FUNCIONES PARA MANEJAR REQUISITOS DE EVENTOS
    const addRequirement = () => {
    eventForm.requirements.push('')
    }

    const removeRequirement = (index) => {
    eventForm.requirements.splice(index, 1)
    }

    // FUNCIÓN PARA ACTUALIZAR typeText AUTOMÁTICAMENTE
    const updateTypeText = () => {
    const typeMap = {
        'adoption': 'Feria de Adopción',
        'fundraising': 'Recaudación de Fondos',
        'volunteer': 'Voluntariado',
        'educational': 'Charla Educativa',
        'workshop': 'Taller'
    }
    eventForm.typeText = typeMap[eventForm.type] || 'Evento'
    }

    // FUNCIÓN PARA FORMATEAR EVENTO AL GUARDAR 
    const formatEventForAPI = (formData) => {
      // Crear fecha en la zona horaria local
      const localDateString = formData.date;
      
      // Dividir la fecha local en partes
      const [year, month, day] = localDateString.split('-').map(Number);
      
      // Crear fecha en UTC pero manteniendo el día local
      const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0)); // Usar mediodía UTC
      
      console.log('Debug fecha:', {
        fechaLocal: formData.date,
        year, month, day,
        fechaUTC: utcDate.toISOString(),
        fechaLocalResultado: new Date(utcDate).toLocaleDateString('es-ES')
      });

      return {
        title: formData.title,
        description: formData.description,
        fullDescription: formData.fullDescription || formData.description,
        type: formData.type,
        typeText: formData.typeText,
        date: utcDate.toISOString(), 
        time: formData.time,
        location: formData.location,
        image: formData.image,
        capacity: parseInt(formData.capacity),
        organizer: formData.organizer,
        highlighted: formData.highlighted,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        status: formData.status
      }
    }

    // Métodos para aplicaciones (placeholders)
    const getAppStatusText = (status) => {
      const statusMap = {
        pending: 'Pendiente',
        approved: 'Aprobada',
        rejected: 'Rechazada'
      }
      return statusMap[status] || status
    }

    // Cargar solicitudes de adopción desde API
    const loadApplications = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        console.log('Cargando solicitudes de adopción...')
        
        const response = await fetch(`${API_BASE_URL}/adoptions/admin/applications`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success) {
          applications.value = data.applications
          // Actualizar estadística de solicitudes pendientes
          stats.pendingApplications = data.applications.filter(app => 
            app.status === 'pending'
          ).length
          console.log('Solicitudes cargadas:', data.applications.length)
        } else {
          console.error('Error en respuesta solicitudes:', data.message)
        }
      } catch (error) {
        console.error('Error cargando solicitudes:', error)
        // Mantener datos de ejemplo si hay error
        applications.value = [
          {
            id: 1,
            user: {
              name: 'Ana García',
              email: 'ana@email.com',
              avatar: '/img/avatars/user1.jpg'
            },
            pet: {
              name: 'Max',
              breed: 'Labrador',
              image: '/img/pets/dog1.jpg'
            },
            reason: 'Tengo un jardín grande y experiencia con perros grandes.',
            status: 'pending',
            appliedAt: '2024-01-25'
          }
        ]
      }
    }

    // Aprobar solicitud - ACTUALIZADO
    const approveApplication = async (id) => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${API_BASE_URL}/adoptions/admin/${id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'approved',
            notes: 'Solicitud aprobada por el administrador'
          })
        })

        const data = await response.json()

        if (data.success) {
          await loadApplications() // Recargar lista
          await loadPets() // Recargar mascotas por si cambió el estado
          alert('Solicitud aprobada exitosamente')
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error('Error aprobando solicitud:', error)
        alert(error.message || 'Error al aprobar solicitud')
      }
    }

    // Rechazar solicitud 
    const rejectApplication = async (id) => {
      if (!confirm('¿Estás seguro de que quieres rechazar esta solicitud?')) return
      
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${API_BASE_URL}/adoptions/admin/${id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'rejected',
            notes: 'Solicitud rechazada por el administrador'
          })
        })

        const data = await response.json()

        if (data.success) {
          await loadApplications() // Recargar lista
          await loadPets() // Recargar mascotas por si cambió el estado
          alert('Solicitud rechazada exitosamente')
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error('Error rechazando solicitud:', error)
        alert(error.message || 'Error al rechazar solicitud')
      }
    }

    const selectedApplication = ref(null)
    const showApplicationModal = ref(false)

    // Métodos para el modal
    const viewApplication = (application) => {
      selectedApplication.value = application
      showApplicationModal.value = true
    }

    const closeApplicationModal = () => {
      selectedApplication.value = null
      showApplicationModal.value = false
    }

    // Helper functions para los textos
    const getHousingTypeText = (type) => {
      const types = {
        'house': 'Casa con patio',
        'apartment': 'Departamento',
        'townhouse': 'Casa sin patio',
        'other': 'Otro'
      }
      return types[type] || type
    }

    const getYardText = (yard) => {
      const yards = {
        'yes': 'Sí, patio propio',
        'no': 'No tiene patio',
        'shared': 'Patio compartido'
      }
      return yards[yard] || yard
    }

    const getLivingSituationText = (situation) => {
      const situations = {
        'alone': 'Vive solo/a',
        'family': 'Con familia',
        'roommates': 'Con roommates'
      }
      return situations[situation] || situation
    }

    const getAgreementText = (agreement) => {
      const agreements = {
        'yes': 'Sí, todos están de acuerdo',
        'some': 'Algunos están de acuerdo',
        'no': 'No están de acuerdo'
      }
      return agreements[agreement] || agreement
    }

    const getSizeText = (size) => {
      const sizes = {
        'pequeño': 'Pequeño',
        'mediano': 'Mediano', 
        'grande': 'Grande'
      }
      return sizes[size] || size
    }

    const getGenderText = (gender) => {
      const genders = {
        'macho': 'Macho',
        'hembra': 'Hembra'
      }
      return genders[gender] || gender
    }

    const commitments = [
      { id: 'vet_care', text: 'Proporcionar atención veterinaria regular' },
      { id: 'lifetime_care', text: 'Cuidar de la mascota el resto de mi vida' },
      { id: 'proper_identification', text: 'Mantendré la identificación y microchip actualizados' },
      { id: 'return_policy', text: 'Devolver al refugio si no puedo cuidarla' },
      { id: 'home_visit', text: 'Autorizo visitas para ver el bienestar de l amascota' }
    ]

    // Computed para reportes
    const totalAdoptions = computed(() => {
      return adoptionsByMonth.value.reduce((sum, item) => sum + item.total, 0)
    })

    const totalSpecies = computed(() => {
      return popularSpecies.value.reduce((sum, item) => sum + item.total, 0)
    })

    const dogAdoptions = computed(() => {
      const dogData = popularSpecies.value.find(item => item.species === 'dog')
      return dogData ? dogData.total : 0
    })

    const catAdoptions = computed(() => {
      const catData = popularSpecies.value.find(item => item.species === 'cat')
      return catData ? catData.total : 0
    })

    const mostPopularSpecies = computed(() => {
      if (popularSpecies.value.length === 0) return 'N/A'
      const topSpecies = popularSpecies.value[0]
      return getSpeciesText(topSpecies.species)
    })

    // Métodos para reportes
    const loadReports = async () => {
      loadingReports.value.adoptions = true
      loadingReports.value.species = true
      
      try {
        const token = localStorage.getItem('auth_token')
        
        // Cargar adopciones por mes
        const adoptionsResponse = await fetch(`${API_BASE_URL}/reports/adoptions-by-month`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (adoptionsResponse.ok) {
          const adoptionsData = await adoptionsResponse.json()
          adoptionsByMonth.value = adoptionsData
          console.log('Adopciones por mes cargadas:', adoptionsData)
        } else {
          console.error('Error cargando adopciones por mes:', adoptionsResponse.status)
        }
        
        // Cargar especies populares
        const speciesResponse = await fetch(`${API_BASE_URL}/reports/popular-species`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (speciesResponse.ok) {
          const speciesData = await speciesResponse.json()
          popularSpecies.value = speciesData
          console.log('Especies populares cargadas:', speciesData)
        } else {
          console.error('Error cargando especies populares:', speciesResponse.status)
        }
      } catch (error) {
        console.error('Error cargando reportes:', error)
        alert('Error al cargar los reportes')
      } finally {
        loadingReports.value.adoptions = false
        loadingReports.value.species = false
      }
    }

    const calculateBarHeight = (value) => {
      if (adoptionsByMonth.value.length === 0) return 0
      const maxValue = Math.max(...adoptionsByMonth.value.map(item => item.total))
      return maxValue > 0 ? (value / maxValue) * 100 : 0
    }

    const calculatePercentage = (value) => {
      return totalSpecies.value > 0 ? Math.round((value / totalSpecies.value) * 100) : 0
    }

    const getSpeciesColor = (index) => {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
      return colors[index % colors.length]
    }

    // Watch para cargar reportes
    watch(() => activeTab.value, (newTab) => {
      if (newTab === 'reports') {
        console.log('Cargando reportes...')
        loadReports()
      }
    })

    onMounted(() => {
      console.log('AdminPanel montado, cargando datos...')
      loadPets()
      loadEvents()
      loadApplications()
    })

    return {
      // Datos
      applications,
      events,
      activeTab,
      showPetForm,
      showEventForm,
      editingPet,
      editingEvent,
      petFilter,
      statusFilter,
      savingPet,
      stats,
      adminTabs,
      pets,            
      filteredPets,   
      petForm,
      eventForm,
      analyzingImage,
      imageSuggestions,
      selectedApplication,       
      showApplicationModal,
      commitments,
      adoptionsByMonth,
      popularSpecies,
      loadingReports,
      reportFilters,
      totalAdoptions,
      totalSpecies,
      dogAdoptions,
      catAdoptions,
      mostPopularSpecies,
      loadReports,
      calculateBarHeight,
      calculatePercentage,
      getSpeciesColor,
      loadApplications,
      addRequirement,
      removeRequirement,
      updateTypeText,
      closeApplicationModal,      
      getHousingTypeText,         
      getYardText,                
      getLivingSituationText,     
      getAgreementText,           
      getHousingTypeText,
      getYardText, 
      getLivingSituationText,
      getAgreementText,
      getSizeText,
      getGenderText,
      getSpeciesText,
      getStatusText,
      formatDate,
      editPet,
      savePet,
      deletePet,
      closePetForm,
      analyzeImage,
      applySuggestion,
      onImageUrlChange,
      getTypeText,
      formatEventDate,
      saveEvent,
      deleteEvent,
      editEvent,
      closeEventForm,
      getAppStatusText,
      approveApplication,
      rejectApplication,
      viewApplication
    }
  }
}
</script>
<style scoped>
.admin-dashboard {
  max-width: 1400px;
  margin: 120px auto 50px;
  padding: 0 20px;
}

/* Header del Admin */
.admin-header {
  background: linear-gradient(135deg, #ff9a24 0%, #c17621 100%);
  color: white;
  padding: 40px;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.admin-info h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.admin-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.stat-card {
  background: rgba(186, 31, 31, 0.1);
  backdrop-filter: blur(10px);
  padding: 25px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card i {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 5px;
}

/* Navegación Admin */
.admin-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.admin-tab {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: #4a5568;
  position: relative;
}

.admin-tab:hover {
  border-color: #ff9a24;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.admin-tab.active {
  background: #ff9a24;
  border-color: #ff9a24;
  color: white;
}

.admin-tab i {
  font-size: 1.2rem;
}

.tab-count {
  background: #ff9a24;
  color: white;
  border-radius: 20px;
  padding: 4px 8px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-left: auto;
}

.admin-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.2);
}

/* Contenido Admin */
.admin-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 50px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
}

.section-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 1.8rem;
}

/* Filtros */
.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.search-input, .filter-select {
  padding: 12px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  min-width: 200px;
}

.search-input:focus, .filter-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Tablas */
.table-container {
  overflow-x: auto;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.data-table th {
  background: #f7fafc;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
}

.data-table td {
  padding: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.data-table tr:hover {
  background: #f7fafc;
}

/* Celdas de mascota */
.pet-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pet-thumb {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.pet-thumb-sm {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
}

.pet-info {
  display: flex;
  flex-direction: column;
}

.pet-info strong {
  color: #2d3748;
}

.pet-info span {
  color: #718096;
  font-size: 0.9rem;
}

/* Badges de estado */
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.available {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.pending {
  background: #fed7d7;
  color: #742a2a;
}

.status-badge.adopted {
  background: #bee3f8;
  color: #1a365d;
}

/* Acciones */
.actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: #e2e8f0;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4a5568;
}

.btn-icon:hover {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.btn-icon.delete:hover {
  background: #e53e3e;
}

/* Grid de Solicitudes */
.applications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.application-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.application-card:hover {
  border-color: #ff9a24;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.app-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info strong {
  color: #2d3748;
}

.user-info span {
  color: #718096;
  font-size: 0.9rem;
}

.app-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.app-status.pending {
  background: #fed7d7;
  color: #742a2a;
}

.app-status.approved {
  background: #c6f6d5;
  color: #22543d;
}

.app-status.rejected {
  background: #e2e8f0;
  color: #4a5568;
}

.app-content {
  margin-bottom: 15px;
}

.app-pet {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.app-pet div {
  display: flex;
  flex-direction: column;
}

.app-reason {
  color: #718096;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.app-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Grid de Eventos */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.event-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.event-card:hover {
  border-color: #ff9a24;
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.event-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.event-content {
  padding: 20px;
}

.event-content h3 {
  margin: 0 0 10px 0;
  color: #2d3748;
  font-size: 1.3rem;
}

.event-description {
  color: #718096;
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.event-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
  font-size: 0.9rem;
}

.event-detail i {
  color: #667eea;
  width: 16px;
}

.event-actions {
  display: flex;
  gap: 10px;
}

/* Reportes */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
}

.report-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 25px;
}

.report-card h3 {
  margin: 0 0 20px 0;
  color: #2d3748;
  text-align: center;
}

.chart-placeholder {
  background: #f7fafc;
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  padding: 60px 20px;
  text-align: center;
  color: #718096;
}

.chart-placeholder i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #cbd5e0;
}

.chart-placeholder p {
  margin: 0;
  font-size: 1.1rem;
}

/* Formularios */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
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
}

.form-group input,
.form-group select,
.form-group textarea {
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
  border-color: #667eea;
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
  background: #d8811d;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
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

.btn-success {
  background: #48bb78;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-success:hover {
  background: #38a169;
}

.btn-danger {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background: #c53030;
}

/* Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 15px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal.large {
  max-width: 800px;
}

.modal h2 {
  margin: 0 0 25px 0;
  color: #2d3748;
  text-align: center;
  font-size: 1.8rem;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 2px solid #e2e8f0;
}

/* Responsive */
@media (max-width: 1024px) {
  .admin-nav {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .applications-grid {
    grid-template-columns: 1fr;
  }
  
  .reports-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    margin: 100px auto 30px;
    padding: 0 15px;
  }
  
  .admin-header {
    padding: 25px;
  }
  
  .admin-info h1 {
    font-size: 2rem;
  }
  
  .admin-stats {
    grid-template-columns: 1fr;
  }
  
  .admin-nav {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .search-input, .filter-select {
    min-width: auto;
  }
  
  .events-grid {
    grid-template-columns: 1fr;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .app-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .app-actions {
    justify-content: stretch;
  }
  
  .app-actions button {
    flex: 1;
  }
  
  .modal {
    padding: 20px;
    margin: 10px;
  }
}

@media (max-width: 480px) {
  .admin-header {
    padding: 20px;
  }
  
  .admin-content {
    padding: 20px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-card i {
    font-size: 2rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .data-table {
    font-size: 0.9rem;
  }
  
  .data-table th,
  .data-table td {
    padding: 10px 8px;
  }
  
  .pet-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .actions {
    flex-direction: column;
    gap: 5px;
  }
}

.image-input-group {
  display: flex;
  gap: 0.5rem;
}

.btn-analysis {
  background: #8B5CF6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
}

.btn-analysis:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-analysis:hover:not(:disabled) {
  background: #7C3AED;
}

.suggestions-panel {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  grid-column: 1 / -1;
}

.suggestions-panel h3 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1rem;
}

.suggestions-grid {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.suggestion-item label {
  font-weight: 600;
  min-width: 120px;
  color: #495057;
}

.suggestion-value {
  flex: 1;
  color: #228B22;
  font-weight: 500;
}

.suggestion-confidence {
  color: #FF6B35;
  font-weight: 600;
}

.btn-suggestion {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-suggestion:hover {
  background: #218838;
}

.appearance-suggestions label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
}

.appearance-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.appearance-tag {
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.loading-state, .error-state {
  padding: 1rem;
  text-align: center;
  margin: 1rem 0;
  border-radius: 8px;
}

.loading-state {
  background: #e3f2fd;
  color: #1976d2;
}

.error-state {
  background: #ffebee;
  color: #d32f2f;
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

/* Estilos para el modal de detalles de solicitud */
.application-status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
}

.application-status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.application-status-badge.approved {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.application-status-badge.rejected {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.application-status-badge.under_review {
  background-color: #e2e3e5;
  color: #383d41;
  border: 1px solid #d6d8db;
}

.application-status-badge.completed {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.modal-content {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 1rem;
}

.detail-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4299e1;
}

.detail-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.2rem;
}

.detail-section h3 i {
  color: #4299e1;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.detail-item span {
  color: #2d3748;
  font-size: 1rem;
}

.pet-detail-card {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.pet-detail-image {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  border: 3px solid #4299e1;
}

.pet-detail-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  color: #2d3748;
}

.pet-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.pet-spec {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #4a5568;
}

.pet-spec i {
  color: #4299e1;
}

.pet-description {
  margin: 0;
  color: #718096;
  line-height: 1.5;
}

.history-text,
.reason-text,
.careplan-text {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border-left: 3px solid #e2e8f0;
  margin: 0.5rem 0 0 0;
  line-height: 1.6;
  color: #4a5568;
}

.commitments-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.commitment-detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 6px;
  background: white;
  border: 1px solid #e2e8f0;
}

.commitment-detail-item.accepted {
  border-color: #c6f6d5;
  background: #f0fff4;
}

.commitment-detail-item i {
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.commitment-detail-item.accepted i {
  color: #38a169;
}

.commitment-detail-item:not(.accepted) i {
  color: #e53e3e;
}

.application-id {
  font-family: 'Courier New', monospace;
  background: #edf2f7;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e9ecef;
}

/* Scrollbar personalizado */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive */
@media (max-width: 768px) {
  .pet-detail-card {
    flex-direction: column;
    text-align: center;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

/* Estilos para Reportes */
.report-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 600;
  color: #495057;
}

.filter-group select {
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  background: white;
}

.btn-refresh {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-refresh:hover {
  background: #218838;
}

.reports-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.report-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.report-header h3 {
  margin: 0;
  color: #2c3e50;
}

.report-stats {
  display: flex;
  gap: 15px;
}

.chart-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-loading, .chart-placeholder {
  text-align: center;
  color: #6c757d;
}

.chart-loading i, .chart-placeholder i {
  font-size: 3em;
  margin-bottom: 15px;
  color: #dee2e6;
}

/* Gráfico de Barras */
.bar-chart {
  display: flex;
  align-items: end;
  gap: 15px;
  height: 250px;
  width: 100%;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
}

.bar-label {
  font-size: 0.8em;
  margin-bottom: 8px;
  text-align: center;
  color: #6c757d;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.bar-track {
  flex: 1;
  width: 30px;
  background: #f8f9fa;
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: end;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #007bff, #0056b3);
  border-radius: 4px;
  transition: height 0.3s ease;
  min-height: 4px;
}

.bar-value {
  margin-top: 8px;
  font-weight: 600;
  color: #495057;
}

/* Gráfico de Pie (simulado) */
.pie-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.pie-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 6px;
  background: #f8f9fa;
}

.pie-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.pie-info {
  display: flex;
  justify-content: space-between;
  flex: 1;
}

.pie-label {
  font-weight: 600;
  color: #495057;
}

.pie-value {
  color: #6c757d;
  font-size: 0.9em;
}

/* Estadísticas rápidas */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

/* Responsive */
@media (max-width: 968px) {
  .reports-grid {
    grid-template-columns: 1fr;
  }
  
  .report-filters {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .bar-chart {
    gap: 8px;
  }
  
  .bar-track {
    width: 20px;
  }
}
</style>