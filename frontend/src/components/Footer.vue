<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Sección Principal -->
      <div class="footer-main">
        <div class="footer-brand">
          <router-link to="/" class="brand-logo">
            <i class="fas fa-paw"></i>
            <span>H<b class="accent">C</b></span>
          </router-link>
          <p class="brand-description">
            Conectando mascotas necesitadas con hogares llenos de amor. 
            Juntos podemos hacer la diferencia en la vida de estos increíbles animales.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link" aria-label="YouTube">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        <div class="footer-links">
          <!-- Navegación -->
          <div class="link-group">
            <h3>Navegación</h3>
            <ul>
              <li><router-link to="/">Inicio</router-link></li>
              <li><router-link to="/about">Sobre Nosotros</router-link></li>
              <li><router-link to="/catalog">Catálogo</router-link></li>
              <li><router-link to="/event">Eventos</router-link></li>
              <li><router-link to="/contact">Contacto</router-link></li>
              <li><router-link to="/adoption">Adoptar</router-link></li>
            </ul>
          </div>

          <!-- Soporte -->
          <div class="link-group">
            <h3>Soporte</h3>
            <ul>
              <li><router-link to="/faq">Preguntas Frecuentes</router-link></li>
              <li><router-link to="/contact">Contacto</router-link></li>
              <li><router-link to="/privacy">Privacidad</router-link></li>
              <li><router-link to="/terms">Términos</router-link></li>
              <li><a href="#" @click.prevent="openDonationModal">Donar</a></li>
            </ul>
          </div>

          <!-- Contacto -->
          <div class="link-group">
            <h3>Contacto</h3>
            <div class="contact-info">
              <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>Av. Animales Felices 123, Puebla</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-phone"></i>
                <span>+52 55 1234 5678</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <span>hc@huellitasconcorazon.org</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-clock"></i>
                <span>Lun-Vie: 9AM - 6PM</span>
              </div>
            </div>
          </div>

          <!-- Newsletter -->
          <div class="link-group newsletter">
            <h3>Newsletter</h3>
            <p>Suscríbete para recibir actualizaciones sobre nuevas mascotas y eventos.</p>
            <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
              <div class="input-group">
                <input 
                  type="email" 
                  v-model="newsletterEmail" 
                  placeholder="tu@email.com" 
                  required
                >
                <button type="submit" class="newsletter-btn">
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Línea divisoria -->
      <div class="footer-divider"></div>

      <!-- Sección Inferior -->
      <div class="footer-bottom">
        <div class="footer-copyright">
          <p>&copy; 2025 Huellitas con Corazón. Todos los derechos reservados.</p>
          <div class="legal-links">
            <router-link to="/privacy">Política de Privacidad</router-link>
            <span class="separator">•</span>
            <router-link to="/terms">Términos de Servicio</router-link>
            <span class="separator">•</span>
            <router-link to="/cookies">Cookies</router-link>
          </div>
        </div>
        
        <div class="footer-badges">
          <div class="badge" title="Organización sin fines de lucro">
            <i class="fas fa-heart"></i>
            <span>Sin fines de lucro</span>
          </div>
          <div class="badge" title="Certificado de transparencia">
            <i class="fas fa-shield-alt"></i>
            <span>Transparencia certificada</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Donación -->
    <div v-if="showDonationModal" class="modal-overlay" @click="closeDonationModal">
      <div class="modal" @click.stop>
        <button class="modal-close" @click="closeDonationModal">
          <i class="fas fa-times"></i>
        </button>
        <h2>Apoya Nuestra Misión</h2>
        <p>Tu donación ayuda a salvar vidas y proporcionar cuidados a mascotas necesitadas.</p>
        
        <div class="donation-options">
          <button 
            v-for="amount in donationAmounts" 
            :key="amount"
            class="donation-option"
            :class="{ active: selectedAmount === amount }"
            @click="selectAmount(amount)"
          >
            ${{ amount }} MXN
          </button>
          <div class="custom-amount">
            <input 
              type="number" 
              v-model="customAmount" 
              placeholder="Otra cantidad"
              @focus="selectCustomAmount"
            >
          </div>
        </div>

        <button class="donate-btn" @click="processDonation">
          <i class="fas fa-heart"></i>
          Donar ${{ donationTotal }} MXN
        </button>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Footer',
  setup() {
    const newsletterEmail = ref('')
    const showDonationModal = ref(false)
    const selectedAmount = ref(100)
    const customAmount = ref('')
    const donationAmounts = [50, 100, 200, 500, 1000]

    const donationTotal = ref(100)

    const subscribeNewsletter = () => {
      if (newsletterEmail.value) {
        console.log('Suscripción a newsletter:', newsletterEmail.value)
        alert('¡Gracias por suscribirte! Te hemos enviado un email de confirmación.')
        newsletterEmail.value = ''
      }
    }

    const openDonationModal = () => {
      showDonationModal.value = true
    }

    const closeDonationModal = () => {
      showDonationModal.value = false
      selectedAmount.value = 100
      customAmount.value = ''
    }

    const selectAmount = (amount) => {
      selectedAmount.value = amount
      customAmount.value = ''
      donationTotal.value = amount
    }

    const selectCustomAmount = () => {
      selectedAmount.value = 0
    }

    const processDonation = () => {
      const amount = customAmount.value || selectedAmount.value
      console.log('Procesando donación:', amount)
      alert(`¡Gracias por tu donación de $${amount} MXN! Te redirigiremos al procesador de pagos.`)
      closeDonationModal()
    }

    const watchCustomAmount = () => {
      if (customAmount.value) {
        donationTotal.value = parseInt(customAmount.value) || 0
      }
    }

    return {
      newsletterEmail,
      showDonationModal,
      selectedAmount,
      customAmount,
      donationAmounts,
      donationTotal,
      subscribeNewsletter,
      openDonationModal,
      closeDonationModal,
      selectAmount,
      selectCustomAmount,
      processDonation,
      watchCustomAmount
    }
  }
}
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  color: white;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px 30px;
}

/* Sección Principal */
.footer-main {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  margin-bottom: 40px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
}

.brand-logo i {
  color: #ff9a24;
  font-size: 2rem;
}

.brand-logo .accent {
  color: #ff9a24;
}

.brand-description {
  color: #cbd5e0;
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.social-link:hover {
  background: #ff9a24;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(255, 154, 36, 0.3);
}

/* Links del Footer */
.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.link-group h3 {
  color: white;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  position: relative;
}

.link-group h3::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 30px;
  height: 2px;
  background: #ff9a24;
}

.link-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-group a {
  color: #cbd5e0;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.link-group a:hover {
  color: #ff9a24;
  transform: translateX(5px);
}

/* Información de Contacto */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #cbd5e0;
  font-size: 0.95rem;
}

.contact-item i {
  color: #ff9a24;
  width: 16px;
  margin-top: 2px;
}

/* Newsletter */
.newsletter p {
  color: #cbd5e0;
  margin: 0 0 20px 0;
  line-height: 1.5;
  font-size: 0.95rem;
}

.newsletter-form {
  width: 100%;
}

.input-group {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.input-group input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 12px 15px;
  color: white;
  font-size: 0.95rem;
}

.input-group input::placeholder {
  color: #a0aec0;
}

.input-group input:focus {
  outline: none;
}

.newsletter-btn {
  background: #ff9a24;
  border: none;
  padding: 12px 20px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.newsletter-btn:hover {
  background: #e6891f;
}

/* Línea Divisoria */
.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  margin: 40px 0 30px;
}

/* Sección Inferior */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-copyright {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-copyright p {
  color: #a0aec0;
  margin: 0;
  font-size: 0.9rem;
}

.legal-links {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.legal-links a {
  color: #cbd5e0;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s ease;
}

.legal-links a:hover {
  color: #ff9a24;
}

.separator {
  color: #a0aec0;
  font-size: 0.8rem;
}

/* Badges */
.footer-badges {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #cbd5e0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.badge i {
  color: #ff9a24;
}

/* Modal de Donación */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.modal {
  background: white;
  padding: 40px;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  position: relative;
  color: #2d3748;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #718096;
  cursor: pointer;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: #e53e3e;
}

.modal h2 {
  margin: 0 0 15px 0;
  color: #2d3748;
  font-size: 1.8rem;
  text-align: center;
}

.modal p {
  color: #718096;
  text-align: center;
  margin: 0 0 30px 0;
  line-height: 1.6;
}

.donation-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.donation-option {
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #4a5568;
}

.donation-option:hover {
  border-color: #ff9a24;
}

.donation-option.active {
  background: #ff9a24;
  border-color: #ff9a24;
  color: white;
}

.custom-amount {
  grid-column: 1 / -1;
}

.custom-amount input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.custom-amount input:focus {
  outline: none;
  border-color: #ff9a24;
}

.donate-btn {
  width: 100%;
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  border: none;
  padding: 18px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.donate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(72, 187, 120, 0.4);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .footer-content {
    padding: 40px 20px 20px;
  }

  .footer-main {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .footer-links {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 25px;
  }

  .legal-links {
    justify-content: center;
  }

  .footer-badges {
    justify-content: center;
  }

  .brand-logo {
    justify-content: center;
  }

  .social-links {
    justify-content: center;
  }

  .donation-options {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .footer-content {
    padding: 30px 15px 15px;
  }

  .footer-main {
    gap: 30px;
  }

  .brand-logo {
    font-size: 1.5rem;
  }

  .brand-logo i {
    font-size: 1.8rem;
  }

  .link-group h3 {
    font-size: 1.1rem;
  }

  .donation-options {
    grid-template-columns: 1fr;
  }

  .modal {
    padding: 30px 20px;
    margin: 10px;
  }

  .modal h2 {
    font-size: 1.5rem;
  }

  .footer-copyright p {
    text-align: center;
  }
}

/* Animaciones suaves */
.footer * {
  transition: all 0.3s ease;
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .footer * {
    transition: none;
  }
}

/* Estados de focus para accesibilidad */
.footer a:focus,
.footer button:focus {
  outline: 2px solid #ff9a24;
  outline-offset: 2px;
}

/* Modo oscuro del sistema */
@media (prefers-color-scheme: dark) {
  .modal {
    background: #2d3748;
    color: white;
  }
  
  .modal p {
    color: #cbd5e0;
  }
  
  .donation-option {
    background: #4a5568;
    border-color: #718096;
    color: #e2e8f0;
  }
  
  .custom-amount input {
    background: #4a5568;
    border-color: #718096;
    color: white;
  }
  
  .custom-amount input::placeholder {
    color: #a0aec0;
  }
}
</style>