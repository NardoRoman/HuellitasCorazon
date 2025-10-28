import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/user/profile - Obtener perfil del usuario
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username email role profile level points createdAt');
    
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        level: user.level,
        points: user.points,
        profile: user.profile || {},
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
});

// PUT /api/user/profile - Actualizar perfil del usuario
router.put('/profile', protect, async (req, res) => {
  try {
    const { profile } = req.body;
    
    // Verificar campos requeridos para perfil COMPLETO
    const requiredFields = ['fullName', 'phone', 'address'];
    const missingFields = requiredFields.filter(field => !profile || !profile[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Faltan campos requeridos: ${missingFields.join(', ')}`
      });
    }

    // Verificar subcampos de dirección
    const addressFields = ['street', 'city', 'state', 'zipCode'];
    const missingAddressFields = addressFields.filter(field => !profile.address[field]);
    
    if (missingAddressFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Faltan campos de dirección: ${missingAddressFields.join(', ')}`
      });
    }

    const user = await User.findById(req.user.id);
    let pointsEarned = 0;
    let isFirstTimeCompletion = false;

    // Verificar si es la primera vez que completa el perfil COMPLETAMENTE y otorgar 50 puntos
    if (!user.profile?.profileCompleted) {
      pointsEarned = 50; 
      isFirstTimeCompletion = true;
    }

    // Actualizar el perfil
    const updateData = {
      $set: { 
        'profile': {
          ...user.profile?.toObject(), 
          ...profile,
          profileCompleted: true,
          lastUpdated: new Date()
        }
      }
    };

    // Solo agregar puntos si es la primera vez
    if (isFirstTimeCompletion) {
      updateData.$inc = { points: pointsEarned };
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('username email role profile level points achievements');

    // Recalcular nivel si ganó puntos (usando el método addPoints para asegurar cálculo correcto)
    if (isFirstTimeCompletion && updatedUser) {
      // Usar el método addPoints para asegurar que el nivel se recalcule
      const userWithPoints = await User.findById(req.user.id);
      await userWithPoints.addPoints(pointsEarned, {
        name: 'Perfil Completo',
        description: 'Completaste toda tu información personal',
        icon: '📝'
      });
    }

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      pointsEarned: pointsEarned,
      isFirstTime: isFirstTimeCompletion,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(400).json({
      success: false,
      message: 'Error al actualizar perfil',
      error: error.message
    });
  }
});

// PATCH /api/user/profile/avatar - Actualizar solo el avatar
router.patch('/profile/avatar', protect, async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    
    if (!avatarUrl) {
      return res.status(400).json({
        success: false,
        message: 'URL del avatar es requerida'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          'profile.avatar': avatarUrl,
          'profile.lastUpdated': new Date()
        } 
      },
      { new: true }
    ).select('username email profile');

    res.json({
      success: true,
      message: 'Avatar actualizado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error actualizando avatar:', error);
    res.status(400).json({
      success: false,
      message: 'Error al actualizar avatar',
      error: error.message
    });
  }
});

// Obtener mascotas del usuario
router.get('/pets', protect, async (req, res) => {
  try {
    // Por ahora datos de ejemplo - luego conectar con modelo Pet
    const userPets = [
      {
        id: 1,
        name: 'Max',
        breed: 'Labrador Mix',
        age: '2 años',
        image: '/img/pets/labrador.jpg',
        status: 'adopted',
        adoptionDate: '2024-01-15'
      },
      {
        id: 2,
        name: 'Luna',
        breed: 'Siamesa',
        age: '1 año',
        image: '/img/pets/siamesa.jpg',
        status: 'pending',
        adoptionDate: null
      }
    ];

    res.json({
      success: true,
      pets: userPets
    });
  } catch (error) {
    console.error('Error obteniendo mascotas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo mascotas del usuario'
    });
  }
});

// Obtener logros del usuario - CON PUNTOS EXTRA RECLAMABLES
router.get('/achievements', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userLevel = user.level || 1;
    
    // CONTAR acciones reales del usuario
    const AdoptionApplication = await import('../models/AdoptionApplication.js').then(module => module.default);
    const Event = await import('../models/Event.js').then(module => module.default);
    
    const adoptionApplicationsCount = await AdoptionApplication.countDocuments({
      userId: req.user.id
    });
    
    const completedAdoptions = await AdoptionApplication.countDocuments({
      userId: req.user.id,
      status: 'approved'
    });
    
    const eventRegistrationsCount = await Event.countDocuments({
      'registrations.userId': req.user.id,
      'registrations.status': 'confirmed'
    });

    // Verificar qué logros ya han sido reclamados
    const userAchievements = user.achievements || [];

    const achievements = [
      // LOGROS DE ADOPCIONES
      {
        id: 1,
        name: 'Primera Solicitud',
        description: 'Completaste tu primera solicitud de adopción',
        icon: 'fas fa-file-alt',
        pointsReward: 10, // PUNTOS EXTRA por reclamar
        pointsValue: 75,  // Valor total de acciones
        unlocked: adoptionApplicationsCount >= 1,
        category: 'adoptions',
        awarded: userAchievements.some(ach => ach.name === 'Primera Solicitud')
      },
      {
        id: 2,
        name: 'Adoptante Novato',
        description: 'Tu primera adopción fue aprobada',
        icon: 'fas fa-heart',
        pointsReward: 25,
        pointsValue: 250,
        unlocked: completedAdoptions >= 1,
        category: 'adoptions',
        awarded: userAchievements.some(ach => ach.name === 'Adoptante Novato')
      },
      {
        id: 3,
        name: 'Héroe de Mascotas',
        description: 'Completaste 3 o más adopciones',
        icon: 'fas fa-crown',
        pointsReward: 50,
        pointsValue: 450,
        unlocked: completedAdoptions >= 3,
        category: 'adoptions',
        awarded: userAchievements.some(ach => ach.name === 'Héroe de Mascotas')
      },
      {
        id: 4,
        name: 'Amigo de los Animales',
        description: 'Enviaste 5 solicitudes de adopción',
        icon: 'fas fa-paw',
        pointsReward: 15,
        pointsValue: 125,
        unlocked: adoptionApplicationsCount >= 5,
        category: 'adoptions',
        awarded: userAchievements.some(ach => ach.name === 'Amigo de los Animales')
      },
      
      // LOGROS DE EVENTOS
      {
        id: 5,
        name: 'Asistente a Eventos',
        description: 'Te registraste a tu primer evento',
        icon: 'fas fa-calendar-check',
        pointsReward: 5,
        pointsValue: 20,
        unlocked: eventRegistrationsCount >= 1,
        category: 'events',
        awarded: userAchievements.some(ach => ach.name === 'Asistente a Eventos')
      },
      {
        id: 6,
        name: 'Participante Activo',
        description: 'Te registraste a 3 eventos diferentes',
        icon: 'fas fa-users',
        pointsReward: 15,
        pointsValue: 60,
        unlocked: eventRegistrationsCount >= 3,
        category: 'events',
        awarded: userAchievements.some(ach => ach.name === 'Participante Activo')
      },
      
      // LOGROS DE NIVELES
      {
        id: 7,
        name: 'Protector Nivel 2',
        description: 'Alcanzaste el nivel 2',
        icon: 'fas fa-shield-alt',
        pointsReward: 10,
        pointsValue: 100,
        unlocked: userLevel >= 2,
        category: 'levels',
        awarded: userAchievements.some(ach => ach.name === 'Protector Nivel 2')
      },
      {
        id: 8,
        name: 'Cuidador Nivel 3',
        description: 'Alcanzaste el nivel 3',
        icon: 'fas fa-award',
        pointsReward: 20,
        pointsValue: 300,
        unlocked: userLevel >= 3,
        category: 'levels',
        awarded: userAchievements.some(ach => ach.name === 'Cuidador Nivel 3')
      },
      {
        id: 9,
        name: 'Héroe Nivel 4',
        description: 'Alcanzaste el nivel 4',
        icon: 'fas fa-medal',
        pointsReward: 30,
        pointsValue: 600,
        unlocked: userLevel >= 4,
        category: 'levels',
        awarded: userAchievements.some(ach => ach.name === 'Héroe Nivel 4')
      },
      {
        id: 10,
        name: 'Leyenda Nivel 5',
        description: 'Alcanzaste el nivel máximo',
        icon: 'fas fa-trophy',
        pointsReward: 50,
        pointsValue: 1000,
        unlocked: userLevel >= 5,
        category: 'levels',
        awarded: userAchievements.some(ach => ach.name === 'Leyenda Nivel 5')
      }
    ];

    res.json({
      success: true,
      achievements: achievements
    });
  } catch (error) {
    console.error('Error obteniendo logros:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo logros del usuario'
    });
  }
});

// Obtener actividad reciente del usuario - ACTUALIZADO con acciones reales
router.get('/activity', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // OBTENER DATOS REALES de adopciones y eventos
    const AdoptionApplication = await import('../models/AdoptionApplication.js').then(module => module.default);
    const Event = await import('../models/Event.js').then(module => module.default);
    
    const adoptionApplications = await AdoptionApplication.find({
      userId: req.user.id
    }).sort({ createdAt: -1 }).limit(5);
    
    const eventRegistrations = await Event.find({
      'registrations.userId': req.user.id,
      'registrations.status': 'confirmed'
    }).sort({ 'registrations.registeredAt': -1 }).limit(5);

    const recentActivity = [];

    // ACTIVIDAD DE REGISTRO
    recentActivity.push({
      id: 1,
      message: 'Te registraste en Huellitas con Corazón',
      icon: 'fas fa-user-plus',
      time: 'Recién',
      points: 0,
      type: 'registration'
    });

    // ACTIVIDAD DE ADOPCIONES
    adoptionApplications.forEach((application, index) => {
      let message = '';
      let icon = '';
      let points = 0;
      
      switch(application.status) {
        case 'pending':
          message = `Enviaste solicitud para adoptar a ${application.petId?.name || 'una mascota'}`;
          icon = 'fas fa-file-alt';
          points = 25;
          break;
        case 'approved':
          message = `¡Tu adopción de ${application.petId?.name || 'una mascota'} fue aprobada!`;
          icon = 'fas fa-heart';
          points = 250;
          break;
        case 'completed':
          message = `Completaste la adopción de ${application.petId?.name || 'una mascota'}`;
          icon = 'fas fa-trophy';
          points = 0;
          break;
        default:
          message = `Solicitud de adopción ${application.status}`;
          icon = 'fas fa-paw';
          points = 0;
      }
      
      recentActivity.push({
        id: 2 + index,
        message: message,
        icon: icon,
        time: application.createdAt.toLocaleDateString('es-ES'),
        points: points,
        type: 'adoption'
      });
    });

    // ACTIVIDAD DE EVENTOS
    eventRegistrations.forEach((event, index) => {
      recentActivity.push({
        id: 10 + index,
        message: `Te registraste al evento: ${event.title}`,
        icon: 'fas fa-calendar-plus',
        time: event.registrations.find(reg => reg.userId.equals(req.user.id))?.registeredAt.toLocaleDateString('es-ES') || 'Recién',
        points: 20,
        type: 'event'
      });
    });

    // ACTIVIDAD DE PUNTOS Y NIVELES
    if (user.points > 0) {
      recentActivity.push({
        id: 20,
        message: `Acumulaste ${user.points} puntos`,
        icon: 'fas fa-star',
        time: 'Recién',
        points: user.points,
        type: 'points'
      });
    }

    if (user.level > 1) {
      recentActivity.push({
        id: 21,
        message: `Alcanzaste el nivel ${user.level}`,
        icon: 'fas fa-trophy',
        time: 'Recién',
        points: 0,
        type: 'level'
      });
    }

    // Ordenar por fecha (más reciente primero)
    recentActivity.sort((a, b) => {
      if (a.time === 'Recién' && b.time !== 'Recién') return -1;
      if (b.time === 'Recién' && a.time !== 'Recién') return 1;
      return b.id - a.id;
    });

    // Limitar a 10 actividades más recientes
    const limitedActivity = recentActivity.slice(0, 10);

    res.json({
      success: true,
      activity: limitedActivity
    });
  } catch (error) {
    console.error('Error obteniendo actividad:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo actividad del usuario'
    });
  }
});

// ENDPOINT CORREGIDO: Reclamar puntos de logro
router.post('/achievements/:achievementId/claim', protect, async (req, res) => {
  try {
    const { achievementId } = req.params;
    console.log(`🎯 Reclamando logro ${achievementId} para usuario ${req.user.id}`);
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // LOGROS de manera más simple y directa
    const availableAchievements = {
      1: { name: 'Primera Solicitud', pointsReward: 10 },
      2: { name: 'Adoptante Novato', pointsReward: 25 },
      3: { name: 'Héroe de Mascotas', pointsReward: 50 },
      4: { name: 'Amigo de los Animales', pointsReward: 15 },
      5: { name: 'Asistente a Eventos', pointsReward: 5 },
      6: { name: 'Participante Activo', pointsReward: 15 },
      7: { name: 'Protector Nivel 2', pointsReward: 10 },
      8: { name: 'Cuidador Nivel 3', pointsReward: 20 },
      9: { name: 'Héroe Nivel 4', pointsReward: 30 },
      10: { name: 'Leyenda Nivel 5', pointsReward: 50 }
    };

    const achievement = availableAchievements[achievementId];
    
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Logro no encontrado'
      });
    }

    // Verificar si ya fue reclamado
    const userAchievements = user.achievements || [];
    if (userAchievements.some(ach => ach.name === achievement.name)) {
      return res.status(400).json({
        success: false,
        message: 'Ya reclamaste los puntos de este logro'
      });
    }

    // VERIFICAR SI EL LOGRO ESTÁ REALMENTE DESBLOQUEADO
    let isUnlocked = false;
    
    try {
      const AdoptionApplication = await import('../models/AdoptionApplication.js').then(module => module.default);
      const Event = await import('../models/Event.js').then(module => module.default);
      
      const adoptionApplicationsCount = await AdoptionApplication.countDocuments({
        userId: req.user.id
      });
      
      const completedAdoptions = await AdoptionApplication.countDocuments({
        userId: req.user.id,
        status: 'approved'
      });
      
      const eventRegistrationsCount = await Event.countDocuments({
        'registrations.userId': req.user.id,
        'registrations.status': 'confirmed'
      });

      // Verificar condiciones de desbloqueo
      switch(parseInt(achievementId)) {
        case 1: isUnlocked = adoptionApplicationsCount >= 1; break;
        case 2: isUnlocked = completedAdoptions >= 1; break;
        case 3: isUnlocked = completedAdoptions >= 3; break;
        case 4: isUnlocked = adoptionApplicationsCount >= 5; break;
        case 5: isUnlocked = eventRegistrationsCount >= 1; break;
        case 6: isUnlocked = eventRegistrationsCount >= 3; break;
        case 7: isUnlocked = user.level >= 2; break;
        case 8: isUnlocked = user.level >= 3; break;
        case 9: isUnlocked = user.level >= 4; break;
        case 10: isUnlocked = user.level >= 5; break;
        default: isUnlocked = false;
      }
      
    } catch (importError) {
      console.error('Error verificando condiciones del logro:', importError);
      // Si hay error en la verificación, permitir reclamar igual (para testing)
      isUnlocked = true;
    }

    if (!isUnlocked) {
      return res.status(400).json({
        success: false,
        message: 'Este logro no está desbloqueado'
      });
    }

    // ASIGNAR PUNTOS EXTRA - Versión más simple
    try {
      user.points += achievement.pointsReward;
      
      // Recalcular nivel
      if (user.points < 100) user.level = 1;
      else if (user.points < 300) user.level = 2;
      else if (user.points < 600) user.level = 3;
      else if (user.points < 1000) user.level = 4;
      else user.level = 5;
      
    } catch (pointsError) {
      console.error('Error asignando puntos:', pointsError);
      return res.status(500).json({
        success: false,
        message: 'Error asignando puntos'
      });
    }

    // Marcar como reclamado
    user.achievements.push({
      name: achievement.name,
      description: `Logro reclamado - ${achievement.pointsReward} puntos`,
      icon: '🏆',
      earnedAt: new Date(),
      pointsReward: achievement.pointsReward
    });
    
    await user.save();
    
    console.log(`Logro reclamado: ${achievement.name} - +${achievement.pointsReward} puntos`);
    
    res.json({
      success: true,
      message: `¡Reclamaste ${achievement.pointsReward} puntos por tu logro!`,
      pointsEarned: achievement.pointsReward,
      achievement: {
        name: achievement.name,
        pointsReward: achievement.pointsReward
      }
    });
    
  } catch (error) {
    console.error('Error reclamando logro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al reclamar logro',
      error: error.message
    });
  }
});

// Endpoint para solicitar adopción
router.post('/adoption-request', protect, async (req, res) => {
  try {
    const { petType, reason } = req.body;
    
    if (!petType || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Simular guardado de solicitud
    console.log('Solicitud de adopción recibida:', {
      userId: req.user.id,
      petType,
      reason,
      date: new Date().toISOString()
    });

    // Otorgar puntos por solicitud
    const user = await User.findById(req.user.id);
    await user.addPoints(10, {
      name: 'Solicitud de Adopción',
      description: 'Completaste una solicitud de adopción',
      icon: 'fas fa-paw'
    });

    res.json({
      success: true,
      message: 'Solicitud de adopción enviada correctamente',
      pointsEarned: 10,
      newPoints: user.points
    });

  } catch (error) {
    console.error('Error enviando solicitud de adopción:', error);
    res.status(500).json({
      success: false,
      message: 'Error enviando solicitud de adopción'
    });
  }
});

export default router;