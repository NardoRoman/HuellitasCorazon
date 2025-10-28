<template>
  <!-- Hero Section -->
  <section class="heropage">
    <div class="hero-headlines">
      <h1>Adopta un amigo peludo</h1>
      <p>Encuentra tu compañero perfecto y dale un hogar lleno de amor.</p>
    </div>
    <div class="hero-headlines-buttons">
      <button class="btn-3" @click="$router.push('/catalog')">Nuestras mascotas</button>
      <button class="btn-3 btn-transparent" @click="$router.push('/contact')">Contactanos</button>
    </div>
    <div class="hero-images">
      <img src="/img/hero-img-1.png" alt="conejo" />
      <img src="/img/hero-img-2.png" alt="perro" />
      <img src="/img/hero-img-3.png" alt="perro" />
    </div>
  </section>

  <!-- Requirements Section -->
    <section class="requirements" id="requirements">
        <div class="requirements-headlines">
            <h1>Proceso de Adopción</h1>
            <p>Nuestro proceso de adopcion es sencillo y está lleno de alegría en cada paso:</p>

            <div class="r-item-container">
                <!-- r item1 -->
                <div class="r-item">
                    <div class="r-logo" style="background-color: #b9ff46;">
                        <i class="fa-regular fa-newspaper"></i>
                    </div>
                    <h5>Presentar una solicitud</h5>
                </div>

                <!-- r item2 -->
                <div class="r-item">
                    <div class="r-logo" style="background-color: #fff846;">
                        <i class="fa-solid fa-phone"></i>
                    </div>
                    <h5>Asistir a una entrevista online</h5>
                </div>

                <!-- r item3 -->
                <div class="r-item">
                    <div class="r-logo" style="background-color: #ff8846;">
                        <i class="fa-solid fa-paw"></i>
                    </div>
                    <h5>Conocer a la mascota en persona</h5>
                </div>

                <!-- r item4 -->
                <div class="r-item">
                    <div class="r-logo" style="background-color: #46c7ff;">
                        <i class="fa-regular fa-file-zipper"></i>
                    </div>
                    <h5>Firmar un contrato de adopción</h5>
                </div>

                <!-- r item5 -->
                <div class="r-item">
                    <div class="r-logo" style="background-color: #4fffca;">
                        <i class="fa-solid fa-handshake"></i>
                    </div>
                    <h5>¡Felicidades por encontrar a tu compañero!</h5>
                </div>
            </div>
        </div>
        <img src="/img/requirements-img.png" alt="">
    </section>
    <!-- End Of Requirements Section -->

  <!-- Pet Section (estático por ahora) -->
  <section class="pets" id="pets">
    <div class="pets-headlines">
      <i class="fa-solid fa-paw"></i>
      <h1>Meet Your Soul Pets</h1>
    </div>

    <div class="pets-collection">
      <div class="pet-item">
        <img src="/img/pet-item-1.png" alt="" />
        <h3>Max</h3>
      </div>
      <div class="pet-item">
        <img src="/img/pet-item-2.png" alt="" />
        <h3>Bruno</h3>
      </div>
      <div class="pet-item">
        <img src="/img/pet-item-3.png" alt="" />
        <h3>Luna</h3>
      </div>
    </div>
    <button class="btn-3 btn-pets" @click="$router.push('/catalog')">
      <p>Ver más mascotas</p>
      <i class="fa-solid fa-arrow-right-long"></i>
    </button>
  </section>

  <!-- About Section -->
    <div class="about" id="about">
        <div class="about-headlines">
            <h1>Sobre Nosotros</h1>
            <p class="reveal-type" data-bg-color="#cccccc" data-fg-color="black">
                Huellitas con Corazón (HC) no es solo
                <b>una organización</b>, es una familia comprometida con el bienestar de los
                animales. Somos una organización dedicada a la adopción de mascotas. Nuestro objetivo es encontrar
                hogares amorosos para
                animales necesitados y promover la tenencia responsable de mascotas.
            </p>

            <div class="about-info">
                <div class="about-info-item">
                    <h5>100+</h5>
                    <h6>Adopciones Exitosas</h6>
                </div>
                <hr class="about-info-divider">
                <div class="about-info-item">
                    <h5>100%</h5>
                    <h6>Tasa de adopción</h6>
                </div>
                <hr class="about-info-divider">
                <div class="about-info-item">
                    <h5>5⭐</h5>
                    <h6>Comunidad Amada</h6>
                </div>
            </div>
            <button class="btn-3">Adopta Ahora</button>
        </div>
        <img src="/img/about-img.png" alt="">
    </div>
    <!-- End Of About Section -->

  <!-- Testimonials Section -->
    <div class="testimonials" id="stories">
        <h6>Nuestras Reseñas</h6>
        <h1>¿Qué dicen nuestros adoptantes?</h1>

        <div class="testimony-container">
            <!-- Testimony Item 1 -->
            <div class="testimony-item">
                <div class="testimony-people">
                    <div class="testimony-name">
                        <img src="/img/testimony-image-1.png" alt="">
                        <div class="testimony-name-item">
                            <h4>María López</h4>
                            <p>Adoptante de Max</p>
                        </div>
                    </div>
                    <i class="fa-solid fa-quote-right"></i>
                </div>
                <p class="testimony-text">
                    "Adoptar a Max fue la mejor decisión que he tomado. Gracias a Huellitas con Corazón por ayudarme a
                    encontrar a mi compañero perfecto."
                </p>
            </div>

            <!-- Testimony Item 2 -->
            <div class="testimony-item">
                <div class="testimony-people">
                    <div class="testimony-name">
                        <img src="/img/testimony-image-2.png" alt="">
                        <div class="testimony-name-item">
                            <h4>Carlos Martínez</h4>
                            <p>Adoptante de Luna</p>
                        </div>
                    </div>
                    <i class="fa-solid fa-quote-right"></i>
                </div>
                <p class="testimony-text">
                    "La experiencia de adoptar a Luna fue increíble. El equipo de HC fue muy amable y me guió en
                    todo el proceso."
                </p>
            </div>

            <!-- Testimony Item 3 -->
            <div class="testimony-item">
                <div class="testimony-people">
                    <div class="testimony-name">
                        <img src="/img/testimony-image-3.png" alt="">
                        <div class="testimony-name-item">
                            <h4>Ana Gómez</h4>
                            <p>Adoptante de Bruno</p>
                        </div>
                    </div>
                    <i class="fa-solid fa-quote-right"></i>
                </div>
                <p class="testimony-text">
                    "Bruno ha traído tanta alegría a mi vida. Estoy muy agradecida con Huellitas con Corazón por
                    hacer posible esta adopción."
                </p>
            </div>
        </div>
    </div>
  <!-- End Of Testimonials Section -->

<br><br><br>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollReveal from 'scrollreveal'
import Lenis from '@studio-freight/lenis'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

let lenis

onMounted(() => {
  lenis = new Lenis()
  const raf = (time) => {
    lenis.raf(time)
    ScrollTrigger.update() // sincroniza con GSAP
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  // ANIMACIÓN HERO SECTION
  gsap.from('.hero-headlines h1', { y: 40, opacity: 0, duration: 1 })
  gsap.from('.hero-headlines p', { y: 40, opacity: 0, duration: 1, delay: 0.3 })
  gsap.from('.hero-headlines-buttons', { y: 40, opacity: 0, duration: 1, delay: 0.6 })
  gsap.from('.hero-images img', {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.2,
    delay: 1,
  })

  // SCROLLTRIGGER para escala de imágenes
  ScrollTrigger.create({
    trigger: '.heropage',
    start: 'top center',
    end: 'center center',
    scrub: 1,
    onToggle: (self) => {
      gsap.to('.hero-images img', {
        scale: self.isActive ? 1 : 1.2,
        duration: 0.5,
      })
    }
  })

  // SCROLLREVEAL animaciones generales
  ScrollReveal().reveal('.pet-item', {
    distance: '40px',
    duration: 800,
    easing: 'ease-in-out',
    interval: 100,
    origin: 'bottom',
  })

  ScrollReveal().reveal('.requirements-headlines h1', {
    distance: '40px',
    duration: 800,
    origin: 'bottom',
  })

  ScrollReveal().reveal('.requirements-headlines p', {
    delay: 300,
    distance: '40px',
    duration: 800,
    origin: 'bottom',
  })

  ScrollReveal().reveal('.r-item', {
    interval: 100,
    distance: '40px',
    duration: 800,
    origin: 'bottom',
  })

  ScrollReveal().reveal('.about-headlines h1', {
    distance: '40px',
    duration: 800,
    origin: 'bottom',
  })

  ScrollReveal().reveal('.about-headlines p', {
    distance: '40px',
    duration: 800,
    origin: 'bottom',
    delay: 300,
  })

  ScrollReveal().reveal('.testimonials h1', {
    distance: '40px',
    duration: 800,
    origin: 'bottom',
  })

  ScrollReveal().reveal('.testimony-item', {
    interval: 150,
    distance: '40px',
    duration: 800,
    origin: 'bottom',
  })

  // SplitType para texto con efecto tipo máquina
  const splitTargets = document.querySelectorAll('.reveal-type')
  splitTargets.forEach((el) => {
    const bg = el.dataset.bgColor || '#000'
    const fg = el.dataset.fgColor || '#fff'
    const text = new SplitType(el, { types: 'chars' })

    gsap.fromTo(
      text.chars,
      { color: bg },
      {
        color: fg,
        duration: 0.3,
        stagger: 0.02,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true,
        },
      }
    )
  })
})


</script>

