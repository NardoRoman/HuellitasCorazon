import mongoose from 'mongoose';

const adoptionApplicationSchema = new mongoose.Schema({
  // Relaciones principales
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'El usuario es requerido'] 
  },
  petId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pet', 
    required: [true, 'La mascota es requerida'] 
  },
  
  // Información personal (del formulario)
  personalInfo: {
    fullName: {
      type: String,
      required: [true, 'El nombre completo es requerido'],
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'El teléfono es requerido'],
      trim: true,
      maxlength: 20
    },
    birthDate: {
      type: Date,
      required: [true, 'La fecha de nacimiento es requerida']
    }
  },
  
  // Situación de vivienda
  housingInfo: {
    housingType: {
      type: String,
      enum: ['house', 'apartment', 'townhouse', 'other'],
      required: true
    },
    hasYard: {
      type: String,
      enum: ['yes', 'no', 'shared'],
      required: true
    },
    livesWithOthers: {
      type: String,
      enum: ['alone', 'family', 'roommates'],
      required: true
    },
    everyoneAgrees: {
      type: String,
      enum: ['yes', 'some', 'no'],
      required: true
    }
  },
  
  // Experiencia con mascotas
  experience: {
    hasPetsBefore: {
      type: String,
      enum: ['yes', 'no'],
      required: true
    },
    hasCurrentPets: {
      type: String,
      enum: ['yes', 'no'],
      required: true
    },
    petHistory: {
      type: String,
      maxlength: 500
    }
  },
  
// Preferencias - ACTUALIZADO para el nuevo formulario
preferences: {
  // Estos vienen automáticamente de la mascota seleccionada
  petType: {
    type: String,
    enum: ['dog', 'cat', 'rabbit', 'bird', 'other'],
    required: true
  },
  petAge: {
    type: String,
    required: true
  },
  petSize: {
    type: String,
    enum: ['pequeño', 'mediano', 'grande'],
    required: true
  },
  petBreed: {
    type: String,
    required: true
  },
  // Estos sí los llena el usuario
  adoptionReason: {
    type: String,
    required: true,
    maxlength: 1000
  },
  carePlan: {
    type: String,
    maxlength: 500
  }
},
  
  // Compromisos (del formulario)
  commitments: {
    vet_care: { type: Boolean, required: true },
    lifetime_care: { type: Boolean, required: true },
    proper_identification: { type: Boolean, required: true },
    return_policy: { type: Boolean, required: true },
    home_visit: { type: Boolean, required: true }
  },
  
  // Estado del proceso de adopción
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  
  // Seguimiento y administración
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }, // Admin/voluntario asignado
  adminNotes: {
    type: String,
    maxlength: 1000
  },
  interviewDate: Date,
  reviewNotes: String,
  
  // Fechas importantes
  appliedAt: { 
    type: Date, 
    default: Date.now 
  },
  reviewedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
adoptionApplicationSchema.index({ userId: 1, status: 1 });
adoptionApplicationSchema.index({ petId: 1, status: 1 });
adoptionApplicationSchema.index({ status: 1 });
adoptionApplicationSchema.index({ createdAt: -1 });

// Método para verificar si la aplicación está activa
adoptionApplicationSchema.methods.isActive = function() {
  return ['pending', 'under_review', 'approved'].includes(this.status);
};

// Virtual para calcular días desde la aplicación
adoptionApplicationSchema.virtual('daysSinceApplication').get(function() {
  return Math.floor((Date.now() - this.appliedAt) / (1000 * 60 * 60 * 24));
});

export default mongoose.model('AdoptionApplication', adoptionApplicationSchema);