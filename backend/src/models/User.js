import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'El username es requerido'],
    unique: true,
    trim: true,
    minlength: 3
  },
  email: { 
    type: String, 
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, 'La contraseña es requerida'],
    minlength: 6
  },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'volunteer'], 
    default: 'user' 
  },
  points: { 
    type: Number, 
    default: 0 
  },
  // ✅ CAMPO PROFILE EXPANDIDO
  profile: {
    // Información Personal
    fullName: {
      type: String,
      trim: true,
      maxlength: 100
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20
    },
    birthDate: {
      type: Date
    },
    occupation: {
      type: String,
      trim: true,
      maxlength: 50
    },
    bio: {
      type: String,
      maxlength: 500,
      default: ''
    },
    // Dirección
    address: {
      street: {
        type: String,
        trim: true,
        maxlength: 200
      },
      city: {
        type: String,
        trim: true,
        maxlength: 50
      },
      state: {
        type: String,
        trim: true,
        maxlength: 50
      },
      zipCode: {
        type: String,
        trim: true,
        maxlength: 10
      },
      references: {
        type: String,
        maxlength: 300,
        default: ''
      }
    },
    // Avatar
    avatar: {
      type: String,
      default: '/img/default-avatar.jpg'
    },
    // Preferencias de notificaciones
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      adoptionNotifications: { type: Boolean, default: true },
      eventNotifications: { type: Boolean, default: false }
    },
    // Metadata del perfil
    profileCompleted: {
      type: Boolean,
      default: false
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  level: {
    type: Number,
    default: 1
  },
  achievements: [{
    name: String,
    description: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now
    },
    pointsReward: Number
  }],
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.addPoints = function(points, achievement = null) {
  this.points += points;
  
  if (this.points < 100) this.level = 1;
  else if (this.points < 300) this.level = 2;
  else if (this.points < 600) this.level = 3;
  else if (this.points < 1000) this.level = 4;
  else this.level = 5;
  
  if (achievement) {
    this.achievements.push({
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      pointsReward: points
    });
  }
  
  return this.save();
};

export default mongoose.model('User', userSchema);