import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  species: {
    type: String,
    enum: ['dog', 'cat', 'rabbit', 'bird', 'other'],
    required: [true, 'La especie es requerida']
  },
  breed: {
    type: String,
    required: [true, 'La raza es requerida'],
    trim: true,
    maxlength: 50
  },
  age: {
    type: String,
    required: [true, 'La edad es requerida'],
    trim: true,
    maxlength: 20
  },
  gender: {
    type: String,
    enum: ['macho', 'hembra'],
    required: [true, 'El sexo es requerido']
  },
  size: {
    type: String,
    enum: ['pequeño', 'mediano', 'grande'],
    required: [true, 'El tamaño es requerido']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['disponible', 'en proceso', 'adoptado'],
    default: 'disponible'
  },
  image: {
    type: String,
    required: [true, 'La imagen es requerida']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Índice para búsquedas eficientes
petSchema.index({ species: 1, status: 1 });
petSchema.index({ createdAt: -1 });

export default mongoose.model('Pet', petSchema);