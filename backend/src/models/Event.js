import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['adoption', 'fundraising', 'volunteer', 'educational'],
    required: true
  },
  typeText: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  participants: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    required: true
  },
  organizer: {
    type: String,
    default: 'Huellitas con Corazón'
  },
  highlighted: {
    type: Boolean,
    default: false
  },
  requirements: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  },
  // NUEVO: Array de registros de usuarios
  registrations: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed'
    },
    guests: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },   
  toObject: { virtuals: true }  
});

// Método para formatear la fecha como lo necesitas en el frontend - CORREGIDO PARA TIMEZONE
eventSchema.virtual('formattedDate').get(function() {
  if (!this.date) {
    return {
      day: '--',
      month: '---',
      year: '----',
      fullDate: 'Fecha no disponible'
    };
  }
  
  // SOLUCIÓN PARA TIMEZONE: Ajustar la fecha a la zona horaria local
  const date = new Date(this.date);
  
  // Compensar la diferencia de timezone para mantener el día correcto
  const timezoneOffset = date.getTimezoneOffset() * 60000; // convertir a milisegundos
  const localDate = new Date(date.getTime() + timezoneOffset);
  
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  
  return {
    day: localDate.getDate().toString(),
    month: months[localDate.getMonth()] || '---',
    year: localDate.getFullYear().toString(),
    fullDate: localDate.toLocaleDateString('es-ES', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  };
});

// Método para verificar si un usuario está registrado
eventSchema.methods.isUserRegistered = function(userId) {
  return this.registrations.some(reg => 
    reg.userId.equals(userId) && reg.status === 'confirmed'
  );
};

// Método para contar participantes confirmados
eventSchema.virtual('confirmedParticipants').get(function() {
  return this.registrations.filter(reg => reg.status === 'confirmed').length;
});

export default mongoose.model('Event', eventSchema);