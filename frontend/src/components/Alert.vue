<template>
  <transition name="alert">
    <div 
      v-if="show" 
      class="alert" 
      :class="[type, position, { dismissible }]"
      role="alert"
    >
      <div class="alert-icon">
        <i class="fas" :class="icon"></i>
      </div>
      
      <div class="alert-content">
        <h5 v-if="title" class="alert-title">{{ title }}</h5>
        <p v-if="message" class="alert-message">{{ message }}</p>
        <slot></slot>
      </div>
      
      <button 
        v-if="dismissible" 
        class="alert-close" 
        @click="dismiss"
        aria-label="Cerrar"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: String,
    message: String,
    dismissible: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: 'top-right',
      validator: (value) => ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'center'].includes(value)
    },
    duration: {
      type: Number,
      default: 0 // 0 = no auto-close
    }
  },
  emits: ['update:show', 'dismissed'],
  
  computed: {
    icon() {
      const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
      }
      return icons[this.type] || 'fa-info-circle'
    }
  },
  
  watch: {
    show(newVal) {
      if (newVal && this.duration > 0) {
        setTimeout(() => {
          this.dismiss()
        }, this.duration)
      }
    }
  },
  
  methods: {
    dismiss() {
      this.$emit('update:show', false)
      this.$emit('dismissed')
    }
  }
}
</script>

<style scoped>
.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  margin: 10px;
  position: fixed;
  z-index: 10000;
  animation: slideIn 0.3s ease-out;
}

/* Posiciones */
.alert.top-right {
  top: 20px;
  right: 20px;
}

.alert.top-left {
  top: 20px;
  left: 20px;
}

.alert.bottom-right {
  bottom: 20px;
  right: 20px;
}

.alert.bottom-left {
  bottom: 20px;
  left: 20px;
}

.alert.center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Tipos de alerta */
.alert.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.alert.error {
  background: #f8d7da;
  border: 1px solid #f1b0b7;
  color: #721c24;
}

.alert.warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
}

.alert.info {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
}

/* Icono */
.alert-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
}

/* Contenido */
.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  margin: 0 0 4px 0;
  font-weight: 600;
  font-size: 1em;
}

.alert-message {
  margin: 0;
  font-size: 0.9em;
  line-height: 1.4;
}

/* Botón cerrar */
.alert-close {
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.alert-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1);
}

/* Animaciones */
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.alert-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .alert {
    max-width: calc(100vw - 40px);
    margin: 10px;
  }
  
  .alert.top-right,
  .alert.top-left,
  .alert.bottom-right,
  .alert.bottom-left {
    right: 20px;
    left: 20px;
  }
}
</style>