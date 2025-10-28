<template>
  <!-- Hero Section -->
  <section class="about-heropage">
    <div class="about-hero-headlines">
      <h1>Sobre Huellitas con Corazón</h1>
      <p>Conoce nuestra historia, misión y el equipo que hace posible salvar vidas peludas.</p>
    </div>
    <div class="about-hero-buttons">
      <button class="about-btn about-btn-primary" @click="$router.push('/contact')">Únete como voluntario</button>
      <button class="about-btn about-btn-secondary" @click="$router.push('/catalog')">Ver mascotas</button>
    </div>
    <div class="about-hero-images">
      <img src="/img/equipo.png" alt="Equipo de voluntarios" />
      <img src="/img/rescatado.png" alt="Mascota rescatada" />
      <img src="/img/requirements-img.png" alt="Proceso de adopción" />
    </div>
  </section>

  <!-- Our Story Section -->
  <section class="about-story">
    <div class="about-story-content">
      <h1>Nuestra Historia</h1>
      <p>Huellitas con Corazón nació en 2018 cuando Ana Rodríguez encontró a un grupo de perritos abandonados en las calles. Lo que comenzó como un acto de compasión se convirtió en una misión de vida.</p>

      <div class="about-timeline">
        <div class="about-timeline-item">
          <div class="about-timeline-icon" style="background-color: #ff6b6b;">
            <i class="fa-solid fa-heart"></i>
          </div>
          <h5>2018 - Fundación</h5>
        </div>

        <div class="about-timeline-item">
          <div class="about-timeline-icon" style="background-color: #4ecdc4;">
            <i class="fa-solid fa-home"></i>
          </div>
          <h5>2019 - Primer Refugio</h5>
        </div>

        <div class="about-timeline-item">
          <div class="about-timeline-icon" style="background-color: #45b7d1;">
            <i class="fa-solid fa-users"></i>
          </div>
          <h5>2020 - Equipo Completo</h5>
        </div>

        <div class="about-timeline-item">
          <div class="about-timeline-icon" style="background-color: #96ce45;">
            <i class="fa-solid fa-trophy"></i>
          </div>
          <h5>2024 - 500+ Rescates</h5>
        </div>
      </div>
    </div>
    <img src="/img/HC.png" alt="Nuestra historia" class="about-story-image">
  </section>

  <!-- Mission & Vision Section -->
  <section class="about-mission">
    <div class="about-mission-content">
      <h1>Misión y Visión</h1>
      <p>
        En <b>Huellitas con Corazón</b> creemos que cada animal merece una segunda oportunidad. 
        Nuestro compromiso va más allá del rescate; buscamos transformar vidas a través del amor y cuidado responsable.
      </p>

      <div class="about-mission-grid">
        <div class="about-mission-item">
          <h5>Misión</h5>
          <p>Rescatar, rehabilitar y encontrar hogares permanentes para animales en situación de abandono</p>
        </div>
        <div class="about-mission-divider"></div>
        <div class="about-mission-item">
          <h5>Visión</h5>
          <p>Ser la organización líder en adopción responsable en Latinoamérica</p>
        </div>
        <div class="about-mission-divider"></div>
        <div class="about-mission-item">
          <h5>Valores</h5>
          <p>Compasión, transparencia y compromiso con la vida animal</p>
        </div>
      </div>
      <button class="about-btn about-btn-primary" @click="$router.push('/contact')">Conoce Más</button>
    </div>
    <img src="/img/myv.jpg" alt="Misión y visión" class="about-mission-image">
  </section>

  <!-- Team Section -->
  <section class="about-team">
    <div class="about-team-header">
      <i class="fa-solid fa-people-group"></i>
      <h1>Nuestro Equipo</h1>
    </div>

    <div class="about-team-grid">
      <div class="about-team-member">
        <img src="/img/team1.jpg" alt="Fundadora" />
        <h3>Ana Rodríguez</h3>
        <p>Fundadora & Directora</p>
      </div>
      <div class="about-team-member">
        <img src="/img/team2.jpg" alt="Veterinario" />
        <h3>Dr. Carlos Méndez</h3>
        <p>Veterinario Jefe</p>
      </div>
      <div class="about-team-member">
        <img src="/img/team3.jpg" alt="Coordinador" />
        <h3>Gael Mendoza</h3>
        <p>Coordinador de Adopciones</p>
      </div>
    </div>
  </section>

  <!-- Impact Section -->
  <section class="about-impact">
    <div class="about-impact-content">
      <h1>Nuestro Impacto</h1>
      <p>Los números hablan por sí solos. Cada estadística representa una vida transformada y un hogar encontrado.</p>

      <div class="about-impact-stats">
        <div class="about-impact-item">
          <div class="about-impact-icon" style="background-color: #b9ff46;">
            <i class="fa-solid fa-paw"></i>
          </div>
          <h5>500+ Animales Rescatados</h5>
        </div>

        <div class="about-impact-item">
          <div class="about-impact-icon" style="background-color: #fff846;">
            <i class="fa-solid fa-house-circle-check"></i>
          </div>
          <h5>450+ Adopciones Exitosas</h5>
        </div>

        <div class="about-impact-item">
          <div class="about-impact-icon" style="background-color: #ff8846;">
            <i class="fa-solid fa-user-group"></i>
          </div>
          <h5>50+ Voluntarios Activos</h5>
        </div>

        <div class="about-impact-item">
          <div class="about-impact-icon" style="background-color: #46c7ff;">
            <i class="fa-solid fa-shield-heart"></i>
          </div>
          <h5>98% Tasa de Éxito</h5>
        </div>
      </div>
    </div>
    <img src="/img/impacto.png" alt="Nuestro impacto" class="about-impact-image">
  </section>

  <!-- How We Work Section -->
  <section class="about-process">
    <div class="about-process-content">
      <h1>¿Cómo Trabajamos?</h1>
      <p>
        Nuestro proceso integral asegura que cada animal reciba el cuidado, amor y atención que necesita 
        antes de encontrar su hogar definitivo. La transparencia y el seguimiento son clave en nuestro trabajo.
      </p>

      <div class="about-process-steps">
        <div class="about-process-step">
          <h5>1. Rescate</h5>
          <p>Identificación y recogida segura de animales en riesgo</p>
        </div>
        <div class="about-process-divider"></div>
        <div class="about-process-step">
          <h5>2. Rehabilitación</h5>
          <p>Atención veterinaria completa y cuidados especializados</p>
        </div>
        <div class="about-process-divider"></div>
        <div class="about-process-step">
          <h5>3. Adopción</h5>
          <p>Proceso riguroso de selección de familias adoptantes</p>
        </div>
      </div>
      <button class="about-btn about-btn-primary" @click="$router.push('/requirements')">Ver Proceso Completo</button>
    </div>
    <img src="/img/process-img.jpg" alt="Nuestro proceso" class="about-process-image">
  </section>

  <!-- Volunteers Section -->
  <section class="about-volunteers">
    <div class="about-volunteers-header">
      <i class="fa-solid fa-hands-helping"></i>
      <h1>Únete al Cambio</h1>
    </div>

    <div class="about-volunteers-grid">
      <div class="about-volunteer-option">
        <img src="/img/testimony-image-1.png" alt="Voluntariado" />
        <h3>Voluntariado</h3>
        <p>Dona tu tiempo y ayuda directamente a los animales</p>
      </div>
      <div class="about-volunteer-option">
        <img src="/img/testimony-image-2.png" alt="Donaciones" />
        <h3>Donaciones</h3>
        <p>Tu aporte económico salva vidas y cubre gastos médicos</p>
      </div>
      <div class="about-volunteer-option">
        <img src="/img/testimony-image-3.png" alt="Hogar temporal" />
        <h3>Hogar Temporal</h3>
        <p>Ofrece un espacio temporal a un animal en transición</p>
      </div>
    </div>
    <button class="about-btn about-btn-cta" @click="$router.push('/contact')">
      <span>Quiero Ayudar</span>
      <i class="fa-solid fa-arrow-right-long"></i>
    </button>
  </section>

  <!-- Testimonials Section -->
  <section class="about-testimonials">
    <h6>Testimonios del Equipo</h6>
    <h1>¿Por qué amamos lo que hacemos?</h1>

    <div class="about-testimonials-grid">
      <div class="about-testimonial">
        <div class="about-testimonial-header">
          <div class="about-testimonial-author">
            <img src="/img/team1.jpg" alt="Ana" />
            <div class="about-testimonial-info">
              <h4>Ana Rodríguez</h4>
              <p>Fundadora</p>
            </div>
          </div>
          <i class="fa-solid fa-quote-right"></i>
        </div>
        <p class="about-testimonial-text">
          "Cada vez que veo a un animal encontrar su hogar definitivo, sé que todo el esfuerzo vale la pena. Esta es mi misión de vida."
        </p>
      </div>

      <div class="about-testimonial">
        <div class="about-testimonial-header">
          <div class="about-testimonial-author">
            <img src="/img/team2.jpg" alt="Carlos" />
            <div class="about-testimonial-info">
              <h4>Dr. Carlos Méndez</h4>
              <p>Veterinario</p>
            </div>
          </div>
          <i class="fa-solid fa-quote-right"></i>
        </div>
        <p class="about-testimonial-text">
          "La transformación física y emocional de los animales que rescatamos es el mejor pago que puedo recibir."
        </p>
      </div>

      <div class="about-testimonial">
        <div class="about-testimonial-header">
          <div class="about-testimonial-author">
            <img src="/img/team3.jpg" alt="Gael" />
            <div class="about-testimonial-info">
              <h4>Gael Mendoza</h4>
              <p>Coordinador</p>
            </div>
          </div>
          <i class="fa-solid fa-quote-right"></i>
        </div>
        <p class="about-testimonial-text">
          "Conectar a las familias perfectas con sus compañeros peludos es lo más gratificante de mi trabajo."
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Reset y estilos base para About */
.about-heropage,
.about-story,
.about-mission,
.about-team,
.about-impact,
.about-process,
.about-volunteers,
.about-testimonials {
  min-width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 5vw, 5rem) clamp(1rem, 3vw, 3rem);
  box-sizing: border-box;
}

/* Hero Section */
.about-heropage {
  flex-direction: column;
  text-align: center;
  background-image: url("img/hero-background-image.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  margin-top: 6.25rem;
  gap: 2.5rem;
}

.about-hero-headlines {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: min(90%, 46.875rem);
  text-align: center;
  margin-bottom: 2.5rem;
}

.about-hero-headlines h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  color: #131313;
  margin-bottom: 1.25rem;
  line-height: 1.2;
}

.about-hero-headlines p {
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  font-weight: 600;
  color: #131313;
  line-height: 1.4;
}

.about-hero-buttons {
  display: flex;
  gap: clamp(1rem, 2vw, 1.5rem);
  margin-bottom: 3.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.about-hero-images {
  display: flex;
  gap: clamp(1rem, 3vw, 2.1875rem);
  flex-wrap: wrap;
  justify-content: center;
}

.about-hero-images img {
  width: clamp(12.5rem, 30vw, 15.625rem);
  height: clamp(15rem, 40vw, 18.75rem);
  object-fit: cover;
  border-radius: 0.9375rem;
  border: 0.1875rem solid #ff9a24;
  flex-shrink: 0;
}

/* Botones */
.about-btn {
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

.about-btn-primary {
  background-color: #131313;
  color: white;
}

.about-btn-primary:hover {
  background-color: #ff9a24;
}

.about-btn-secondary {
  background-color: transparent;
  color: #131313;
  border: 0.0625rem solid #131313;
  text-align: center;
  justify-content: center;
}

.about-btn-secondary:hover {
  background-color: #ff9a24;
  color: white;
  border-color: #ff9a24;
}

.about-btn-cta {
  width: clamp(14rem, 30vw, 16.8125rem);
  height: clamp(3rem, 7vh, 3.75rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  border-radius: 0px;
  background-color: #131313;
  color: white;
  margin-top: 3rem;
}

.about-btn-cta:hover {
  background-color: #ff9a24;
}

/* Story Section */
.about-story {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);
  background-image: url("./img/requirements-background-img.png");
  flex-wrap: wrap;
}

.about-story-content {
  max-width: min(90%, 41.125rem);
  flex: 1;
  min-width: min(100%, 20rem);
}

.about-story-content h1 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  color: #131313;
  margin-bottom: 1.25rem;
  line-height: 1.1;
}

.about-story-content p {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 600;
  color: #131313;
  margin-bottom: 3rem;
  line-height: 1.4;
}

.about-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

.about-timeline-item {
  display: flex;
  align-items: center;
  gap: 1.125rem;
}

.about-timeline-icon {
  width: clamp(2.5rem, 6vw, 3.125rem);
  height: clamp(2.5rem, 6vw, 3.125rem);
  border: 0.0625rem solid #131313;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.about-timeline-icon i {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  color: white;
}

.about-timeline-item h5 {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 600;
  color: #131313;
}

.about-story-image {
  width: min(90%, 31.25rem);
  height: auto;
  border-radius: 0.625rem;
  flex: 1;
  min-width: min(100%, 18.75rem);
}

/* Mission Section */
.about-mission {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(2rem, 4vw, 2.5rem);
  padding: 0 clamp(1rem, 3vw, 3rem);
  flex-wrap: wrap;
}

.about-mission-content {
  display: flex;
  flex-direction: column;
  max-width: min(90%, 53.4375rem);
  flex: 1;
  min-width: min(100%, 20rem);
}

.about-mission-content h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  color: #131313;
  margin-bottom: 1.25rem;
  line-height: 1.2;
}

.about-mission-content p {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 400;
  color: #131313;
  margin-bottom: 2.5rem;
  line-height: 1.4;
}

.about-mission-grid {
  display: flex;
  justify-content: center;
  gap: clamp(1rem, 3vw, 2.5rem);
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.about-mission-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: min(100%, 15rem);
}

.about-mission-item h5 {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 800;
  color: #131313;
  margin-bottom: 0.625rem;
}

.about-mission-item p {
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 600;
  line-height: 1.3;
  color: #666;
  margin-bottom: 0;
}

.about-mission-divider {
  width: 0.125rem;
  background-color: #ddd;
  min-height: 6.25rem;
}

.about-mission-image {
  width: min(90%, 31.25rem);
  height: auto;
  border-radius: 0.625rem;
  flex: 1;
  min-width: min(100%, 18.75rem);
}

/* Team Section */
.about-team {
  flex-direction: column;
  text-align: center;
  gap: 2rem;
}

.about-team-header {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.about-team-header i {
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  color: #7291ff;
}

.about-team-header h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  color: #131313;
}

.about-team-grid {
  display: flex;
  gap: clamp(1rem, 3vw, 1.5rem);
  justify-content: center;
  flex-wrap: wrap;
}

.about-team-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
  min-width: min(100%, 18.75rem);
}

.about-team-member img {
  width: clamp(8rem, 20vw, 12.5rem);
  height: clamp(8rem, 20vw, 12.5rem);
  object-fit: cover;
  border-radius: 50%;
  border: 0.1875rem solid #ff9a24;
}

.about-team-member h3 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #131313;
}

.about-team-member p {
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 600;
  color: #666;
}

/* Impact Section */
.about-impact {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(2rem, 5vw, 5rem);
  background-image: url("./img/requirements-background-img.png");
  flex-wrap: wrap;
}

.about-impact-content {
  max-width: min(90%, 41.125rem);
  flex: 1;
  min-width: min(100%, 20rem);
}

.about-impact-content h1 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  color: #131313;
  margin-bottom: 1.25rem;
  line-height: 1.1;
}

.about-impact-content p {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 600;
  color: #131313;
  margin-bottom: 3rem;
  line-height: 1.4;
}

.about-impact-stats {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

.about-impact-item {
  display: flex;
  align-items: center;
  gap: 1.125rem;
}

.about-impact-icon {
  width: clamp(2.5rem, 6vw, 3.125rem);
  height: clamp(2.5rem, 6vw, 3.125rem);
  border: 0.0625rem solid #131313;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.about-impact-icon i {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  color: white;
}

.about-impact-item h5 {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 600;
  color: #131313;
}

.about-impact-image {
  width: min(90%, 31.25rem);
  height: auto;
  border-radius: 0.625rem;
  flex: 1;
  min-width: min(100%, 18.75rem);
}

/* Process Section */
.about-process {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(2rem, 4vw, 2.5rem);
  padding: 0 clamp(1rem, 3vw, 3rem);
  flex-wrap: wrap;
}

.about-process-content {
  display: flex;
  flex-direction: column;
  max-width: min(90%, 53.4375rem);
  flex: 1;
  min-width: min(100%, 20rem);
}

.about-process-content h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  color: #131313;
  margin-bottom: 1.25rem;
  line-height: 1.2;
}

.about-process-content p {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 400;
  color: #131313;
  margin-bottom: 2.5rem;
  line-height: 1.4;
}

.about-process-steps {
  display: flex;
  justify-content: center;
  gap: clamp(1rem, 3vw, 2.5rem);
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.about-process-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  min-width: min(100%, 15rem);
}

.about-process-step h5 {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 800;
  color: #131313;
  margin-bottom: 0.625rem;
}

.about-process-step p {
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 600;
  line-height: 1.3;
  color: #666;
  margin-bottom: 0;
}

.about-process-divider {
  width: 0.125rem;
  background-color: #ddd;
  min-height: 6.25rem;
}

.about-process-image {
  width: min(90%, 31.25rem);
  height: auto;
  border-radius: 0.625rem;
  flex: 1;
  min-width: min(100%, 18.75rem);
}

/* Volunteers Section */
.about-volunteers {
  flex-direction: column;
  text-align: center;
  gap: 2rem;
}

.about-volunteers-header {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.about-volunteers-header i {
  font-size: clamp(2.5rem, 6vw, 3.5rem);
  color: #7291ff;
}

.about-volunteers-header h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  color: #131313;
}

.about-volunteers-grid {
  display: flex;
  gap: clamp(1rem, 3vw, 1.5rem);
  justify-content: center;
  flex-wrap: wrap;
}

.about-volunteer-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
  min-width: min(100%, 18.75rem);
}

.about-volunteer-option img {
  width: clamp(8rem, 20vw, 12.5rem);
  height: clamp(8rem, 20vw, 12.5rem);
  object-fit: cover;
  border-radius: 0.625rem;
  border: 0.125rem solid #ff9a24;
}

.about-volunteer-option h3 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #131313;
}

.about-volunteer-option p {
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 600;
  color: #666;
  max-width: 15.625rem;
}

/* Testimonials Section */
.about-testimonials {
  flex-direction: column;
  text-align: center;
  margin-top: 3.125rem;
  gap: 2rem;
}

.about-testimonials h6 {
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  font-weight: 800;
  color: #ff9a24;
  margin-bottom: 0.625rem;
}

.about-testimonials h1 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  color: #131313;
  margin-bottom: 2.125rem;
}

.about-testimonials-grid {
  display: flex;
  gap: clamp(1rem, 3vw, 1.5rem);
  justify-content: center;
  flex-wrap: wrap;
}

.about-testimonial {
  display: flex;
  flex-direction: column;
  width: min(90%, 26.875rem);
  min-height: 13.875rem;
  border: 0.0625rem solid #ff9a24;
  border-radius: 0.75rem;
  padding: clamp(1rem, 3vw, 1.5rem) clamp(1.25rem, 4vw, 2rem);
  flex: 1;
  min-width: min(100%, 20rem);
}

.about-testimonial-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.about-testimonial-author {
  display: flex;
  gap: 0.875rem;
  align-items: center;
}

.about-testimonial-author img {
  width: clamp(3rem, 8vw, 3.75rem);
  height: clamp(3rem, 8vw, 3.75rem);
  object-fit: cover;
  border-radius: 50%;
}

.about-testimonial-info h4 {
  font-size: clamp(1.125rem, 2.5vw, 1.25rem);
  font-weight: 800;
  color: #131313;
  text-align: left;
}

.about-testimonial-info p {
  opacity: 0.8;
  text-align: left;
  font-size: clamp(0.875rem, 2vw, 0.875rem);
}

.about-testimonial-header i {
  font-size: clamp(2rem, 5vw, 3.125rem);
  color: #ff5353;
}

.about-testimonial-text {
  font-weight: 600;
  color: #131313;
  text-align: left;
  line-height: 1.4;
  font-size: clamp(0.875rem, 2vw, 1rem);
}

/* Responsive Design Mejorado */
@media (max-width: 768px) {
  .about-heropage,
  .about-story,
  .about-mission,
  .about-impact,
  .about-process {
    flex-direction: column;
    padding: clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 1.5rem);
    gap: 2rem;
  }

  .about-mission-divider,
  .about-process-divider {
    width: 80%;
    height: 0.125rem;
    min-height: auto;
    margin: 1rem 0;
  }

  .about-hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .about-btn {
    width: 100%;
    max-width: 18.75rem;
  }

  .about-timeline-item,
  .about-impact-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .about-team-header,
  .about-volunteers-header {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .about-heropage {
    margin-top: 5rem;
  }

  .about-hero-images {
    flex-direction: column;
    align-items: center;
  }

  .about-story-content h1,
  .about-impact-content h1 {
    font-size: clamp(2rem, 8vw, 2.5rem);
  }

  .about-testimonial {
    min-height: auto;
  }
}

/* Utilidades para mejorar la experiencia móvil */
@media (hover: none) {
  .about-btn:hover {
    transform: none;
  }
}

/* Mejora de rendimiento para dispositivos táctiles */
@media (pointer: coarse) {
  .about-btn {
    min-height: 2.75rem;
  }
}
</style>