<template>
  <!-- Hero Section -->
  <section class="contact-hero">
    <div class="contact-hero-content">
      <h1>Contáctanos</h1>
      <p>Estamos aquí para ayudarte. ¡No dudes en ponerte en contacto con nosotros!</p>
      <div class="contact-hero-buttons">
        <button class="contact-btn contact-btn-primary" @click="scrollToFaq">
          Preguntas Frecuentes
        </button>
        <button class="contact-btn contact-btn-secondary" @click="scrollToInfo">
          Ver Información
        </button>
      </div>
    </div>
  </section>

  <!-- Información de Contacto -->
  <section class="contact-info" ref="infoSection">
    <div class="contact-container">
      <div class="contact-header">
        <i class="fa-solid fa-address-book"></i>
        <h2>Información de Contacto</h2>
        <p>Múltiples formas de ponerte en contacto con nosotros</p>
      </div>

      <div class="info-grid">
        <div class="info-card">
          <div class="info-icon">
            <i class="fa-solid fa-location-dot"></i>
          </div>
          <h3>Visítanos</h3>
          <p>Av. Principal #123<br>Colonia Centro<br>Ciudad, CP 12345</p>
          <button class="contact-btn contact-btn-outline" @click="openMap">
            <i class="fa-solid fa-map"></i>
            Ver en Mapa
          </button>
        </div>

        <div class="info-card">
          <div class="info-icon">
            <i class="fa-solid fa-phone"></i>
          </div>
          <h3>Llámanos</h3>
          <p>Tel: (555) 123-4567<br>Cel: (555) 987-6543<br>Horario: 9:00 AM - 6:00 PM</p>
          <button class="contact-btn contact-btn-outline" @click="makeCall">
            <i class="fa-solid fa-phone"></i>
            Llamar Ahora
          </button>
        </div>

        <div class="info-card">
          <div class="info-icon">
            <i class="fa-solid fa-envelope"></i>
          </div>
          <h3>Escríbenos</h3>
          <p>adopciones@huellitas.com<br>voluntarios@huellitas.com<br>info@huellitas.com</p>
          <button class="contact-btn contact-btn-outline" @click="sendEmail">
            <i class="fa-solid fa-envelope"></i>
            Enviar Email
          </button>
        </div>

        <div class="info-card">
          <div class="info-icon">
            <i class="fa-solid fa-clock"></i>
          </div>
          <h3>Horarios</h3>
          <p>Lunes a Viernes: 9AM - 6PM<br>Sábados: 10AM - 4PM<br>Domingos: Cerrado</p>
          <button class="contact-btn contact-btn-outline" @click="checkAvailability">
            <i class="fa-solid fa-calendar-check"></i>
            Ver Disponibilidad
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Preguntas Frecuentes -->
  <section class="contact-faq" ref="faqSection">
    <div class="contact-container">
      <div class="faq-header">
        <h2>Preguntas Frecuentes</h2>
        <p>Respuestas rápidas a las consultas más comunes</p>
      </div>

      <div class="faq-grid">
        <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
          <div class="faq-question" @click="toggleFaq(index)">
            <h4>{{ faq.question }}</h4>
            <i class="fa-solid" :class="faq.open ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </div>
          <div class="faq-answer" :class="{ 'open': faq.open }">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Mapa -->
  <section class="contact-map">
    <div class="contact-container">
      <h2>Encuéntranos</h2>
      <div class="map-container">
        <div class="map-placeholder">
          <i class="fa-solid fa-map-location-dot"></i>
          <h3>Mapa de Ubicación</h3>
          <p>Av. Principal #123, Colonia Centro, Ciudad</p>
          <button class="contact-btn contact-btn-primary" @click="openMap">
            <i class="fa-solid fa-directions"></i>
            Cómo Llegar
          </button>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Contact',
  setup() {
    const infoSection = ref(null)
    const faqSection = ref(null)
    const loading = ref(false)
    const showSuccessModal = ref(false)

    const faqs = ref([
      {
        question: "¿Cuáles son los requisitos para adoptar?",
        answer: "Necesitas ser mayor de edad, presentar identificación, comprobante de domicilio y estar dispuesto a una entrevista y seguimiento post-adopción.",
        open: false
      },
      {
        question: "¿Puedo ser voluntario si trabajo tiempo completo?",
        answer: "Sí, tenemos horarios flexibles y diferentes tipos de voluntariado que se adaptan a tu disponibilidad.",
        open: false
      },
      {
        question: "¿Qué tipo de donaciones aceptan?",
        answer: "Aceptamos donaciones económicas, alimento para mascotas, medicamentos, cobijas, juguetes y otros suministros.",
        open: false
      },
      {
        question: "¿Hacen rescates de animales en situación de calle?",
        answer: "Sí, tenemos un programa de rescate. Reporta animales en situación de riesgo a nuestro número de emergencias.",
        open: false
      },
      {
        question: "¿Ofrecen servicios de esterilización?",
        answer: "Sí, realizamos jornadas de esterilización gratuitas o a bajo costo periódicamente.",
        open: false
      }
    ])

    const scrollToFaq = () => {
      faqSection.value?.scrollIntoView({ behavior: 'smooth' })
    }

    const scrollToInfo = () => {
      infoSection.value?.scrollIntoView({ behavior: 'smooth' })
    }

    const closeModal = () => {
      showSuccessModal.value = false
    }

    const toggleFaq = (index) => {
      faqs.value[index].open = !faqs.value[index].open
    }

    const openMap = () => {
      window.open('https://maps.google.com/?q=Av.+Principal+123,+Ciudad', '_blank')
    }

    const makeCall = () => {
      window.open('tel:+5551234567')
    }

    const sendEmail = () => {
      window.open('mailto:adopciones@huellitas.com')
    }

    const checkAvailability = () => {
      alert('Funcionalidad de calendario en desarrollo')
    }

    const printConfirmation = () => {
      window.print()
    }

    return {
      infoSection,
      faqSection,
      faqs,
      loading,
      showSuccessModal,
      scrollToInfo,
      scrollToFaq,
      toggleFaq,
      openMap,
      makeCall,
      sendEmail,
      checkAvailability,
      printConfirmation
    }
  }
}
</script>


<style scoped>
/* Estilos del Hero */
.contact-hero {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("img/hero-background-image.png");
  text-align: center;
  color: #131313;
  padding: 80px 20px;
}

.contact-hero-content h1 {
  font-size: 64px;
  font-weight: 900;
  margin-bottom: 20px;
}

.contact-hero-content p {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 40px;
}

.contact-hero-buttons {
  display: flex;
  gap: 24px;
  justify-content: center;
}

/* Botones */
.contact-btn {
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
  justify-content: center;
}

.contact-btn-primary {
  background-color: #131313;
  color: white;
}

.contact-btn-primary:hover {
  background-color: #ff9a24;
}

.contact-btn-secondary {
  background-color: transparent;
  color: #131313;
  border: 2px solid #131313;
}

.contact-btn-secondary:hover {
  background-color: #ff9a24;
  color: white;
  border: #ff9a24;
}

.contact-btn-outline {
  background-color: transparent;
  color: #131313;
  border: 2px solid #131313;
}

.contact-btn-outline:hover {
  background-color: #131313;
  color: white;
}

.contact-btn-large {
  padding: 15px 30px;
  font-size: 18px;
}

.contact-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Contenedor principal */
.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Información de Contacto */
.contact-info {
  padding: 80px 0;
  background-color: #f8f9fa;
}

.contact-header {
  text-align: center;
  margin-bottom: 60px;
}

.contact-header i {
  font-size: 56px;
  color: #ff9a24;
  margin-bottom: 20px;
}

.contact-header h2 {
  font-size: 48px;
  font-weight: 800;
  color: #131313;
  margin-bottom: 16px;
}

.contact-header p {
  font-size: 20px;
  color: #666;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.info-card {
  background: white;
  border-radius: 15px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-icon {
  width: 80px;
  height: 80px;
  background: #ff9a24;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.info-icon i {
  font-size: 32px;
  color: white;
}

.info-card h3 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #131313;
}

.info-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

/* Formulario */
.contact-form-section {
  padding: 80px 0;
  background: white;
}

.form-header {
  text-align: center;
  margin-bottom: 50px;
}

.form-header h2 {
  font-size: 42px;
  font-weight: 800;
  color: #131313;
  margin-bottom: 16px;
}

.form-header p {
  font-size: 20px;
  color: #666;
}

.form-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.form-container {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 40px;
}

.user-info-banner {
  background: #e8f5e8;
  border: 1px solid #4caf50;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2e7d32;
}

.user-info-banner i {
  color: #4caf50;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #131313;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff9a24;
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #f5f5f5;
  color: #666;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
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
  font-size: 14px;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.form-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

/* Sidebar */
.form-sidebar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.sidebar-card {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  border-left: 4px solid #ff9a24;
}

.sidebar-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #131313;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-card h3 i {
  color: #ff9a24;
}

.tips-list {
  list-style: none;
  padding: 0;
}

.tips-list li {
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
  color: #666;
}

.tips-list li:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #ff9a24;
  font-weight: bold;
}

.contact-history {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #ff9a24;
}

.history-subject {
  font-weight: 600;
  color: #131313;
}

.history-date {
  font-size: 12px;
  color: #666;
}

.history-status {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.history-status.respondido {
  background: #e8f5e8;
  color: #2e7d32;
}

.history-status.en-proceso {
  background: #fff3e0;
  color: #f57c00;
}

/* FAQ */
.contact-faq {
  padding: 80px 0;
  background: #f8f9fa;
}

.faq-header {
  text-align: center;
  margin-bottom: 50px;
}

.faq-header h2 {
  font-size: 42px;
  font-weight: 800;
  color: #131313;
  margin-bottom: 16px;
}

.faq-header p {
  font-size: 20px;
  color: #666;
}

.faq-grid {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  border-radius: 10px;
  margin-bottom: 15px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.faq-question {
  padding: 20px 25px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
}

.faq-question:hover {
  background: #f8f9fa;
}

.faq-question h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #131313;
}

.faq-question i {
  color: #ff9a24;
  transition: transform 0.3s ease;
}

.faq-answer {
  padding: 0 25px;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-answer.open {
  padding: 0 25px 25px;
  max-height: 200px;
}

.faq-answer p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Mapa */
.contact-map {
  padding: 80px 0;
  background: white;
}

.contact-map h2 {
  text-align: center;
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 40px;
  color: #131313;
}

.map-container {
  background: #f8f9fa;
  border-radius: 15px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-placeholder {
  text-align: center;
  color: #666;
}

.map-placeholder i {
  font-size: 64px;
  color: #ff9a24;
  margin-bottom: 20px;
}

.map-placeholder h3 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #131313;
}

/* Modal */
.contact-modal {
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
  padding: 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.modal-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.modal-icon.success {
  background: #e8f5e8;
  color: #4caf50;
}

.modal-icon i {
  font-size: 32px;
}

.modal-content h3 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #131313;
}

.modal-content p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .contact-hero-content h1 {
    font-size: 48px;
  }
  
  .contact-hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>