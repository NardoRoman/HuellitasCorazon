import express from 'express';
import AdoptionApplication from '../models/AdoptionApplication.js';
import Pet from '../models/Pet.js';
import User from '../models/User.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// POST /api/adoptions - Crear nueva solicitud de adopción 
router.post('/', protect, async (req, res) => {
  try {
    const { petId, ...applicationData } = req.body;

    // Verificar que la mascota existe y está disponible
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    if (pet.status !== 'disponible') {
      return res.status(400).json({
        success: false,
        message: 'Esta mascota no está disponible para adopción'
      });
    }

    // Verificar que el usuario no tiene ya una solicitud activa para esta mascota
    const existingApplication = await AdoptionApplication.findOne({
      userId: req.user._id,
      petId: petId,
      status: { $in: ['pending', 'under_review', 'approved'] }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes una solicitud activa para esta mascota'
      });
    }

    // Crear la solicitud de adopción
    const application = new AdoptionApplication({
      userId: req.user._id,
      petId: petId,
      personalInfo: applicationData.personalInfo,
      housingInfo: applicationData.housingInfo,
      experience: applicationData.experience,
      preferences: {
        petType: pet.species,
        petAge: pet.age,
        petSize: pet.size,
        petBreed: pet.breed,
        adoptionReason: applicationData.preferences.adoptionReason,
        carePlan: applicationData.preferences.carePlan || ''
      },
      commitments: applicationData.commitments
    });

    await application.save();
    
    // Cambiar estado de la mascota a "en proceso"
    pet.status = 'en proceso';
    await pet.save();
    
    // Asignar 25 puntos usando el método existente
    let pointsEarned = 0;
    let achievement = null;

    try {
      const user = await User.findById(req.user._id);
      if (user) {
        // Verificar si es el primer formulario completado
        const adoptionApplicationsCount = await AdoptionApplication.countDocuments({
          userId: req.user._id
        });
        
        if (adoptionApplicationsCount === 1) {
          // Primer formulario de adopción completado - usar método addPoints
          await user.addPoints(75, { // 25 base + 50 extra
            name: 'Primer Formulario de Adopción',
            description: 'Completaste tu primera solicitud de adopción',
            icon: '📝'
          });
          pointsEarned = 75;
          achievement = 'first_adoption_form';
        } else {
          // Solicitud normal - solo 25 puntos
          await user.addPoints(25);
          pointsEarned = 25;
        }
        
        console.log(`Puntos asignados: +${pointsEarned} puntos a usuario ${user.username}. Total: ${user.points}`);
      }
    } catch (pointsError) {
      console.error('Error asignando puntos:', pointsError);
      // No fallar la solicitud por error en puntos
    }
    
    // Poblar la información para la respuesta
    await application.populate('petId', 'name species breed image status');

    res.status(201).json({
      success: true,
      message: 'Solicitud de adopción enviada exitosamente. La mascota ahora está en proceso de adopción.',
      application: {
        id: application._id,
        pet: application.petId,
        status: application.status,
        appliedAt: application.appliedAt
      },
      pointsEarned: pointsEarned,
      achievement: achievement
    });

  } catch (error) {
    console.error('Error creando solicitud de adopción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear solicitud de adopción',
      error: error.message
    });
  }
});

// Completar adopción y asignar 250 puntos + logro
router.put('/:id/complete', protect, admin, async (req, res) => {
  try {
    const application = await AdoptionApplication.findById(req.params.id)
      .populate('petId')
      .populate('userId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud de adopción no encontrada'
      });
    }

    if (application.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Esta adopción ya fue completada anteriormente'
      });
    }

    // Guardar estado anterior
    const previousStatus = application.status;

    // Actualizar estado de la aplicación
    application.status = 'completed';
    application.completedAt = new Date();
    await application.save();

    // Actualizar estado de la mascota si es necesario
    if (application.petId) {
      application.petId.status = 'adoptado';
      await application.petId.save();
    }

    // Asignar puntos usando método addPoints
    let pointsAwarded = 0;
    let achievementAwarded = null;

    try {
      const user = await User.findById(application.userId._id);
      if (user) {
        const completedAdoptions = await AdoptionApplication.countDocuments({
          userId: application.userId._id,
          status: 'completed'
        });

        if (completedAdoptions === 1) {
          // Primera adopción completada - 250 + 100 puntos extra
          await user.addPoints(350, {
            name: 'Primera Adopción Completada',
            description: 'Completaste tu primera adopción exitosamente',
            icon: '🏆'
          });
          pointsAwarded = 350;
          achievementAwarded = 'first_adoption';
        } else if (completedAdoptions >= 3) {
          // Verificar si ya tiene el logro de héroe
          const hasHeroAchievement = user.achievements.some(ach => 
            ach.name === 'Héroe de Mascotas'
          );
          
          if (!hasHeroAchievement) {
            await user.addPoints(450, { // 250 + 200 puntos extra
              name: 'Héroe de Mascotas',
              description: 'Has completado 3 o más adopciones',
              icon: '🦸'
            });
            pointsAwarded = 450;
            achievementAwarded = 'pet_hero';
          } else {
            // Adopción normal después de 3+
            await user.addPoints(250);
            pointsAwarded = 250;
          }
        } else {
          // Adopción normal (2da, 3ra sin logro, etc.)
          await user.addPoints(250);
          pointsAwarded = 250;
        }

        console.log(`Adopción completada: +${pointsAwarded} puntos a usuario ${user.username}. Logro: ${achievementAwarded}`);
      }
    } catch (pointsError) {
      console.error('Error asignando puntos por adopción completada:', pointsError);
    }

    res.json({
      success: true,
      message: 'Adopción marcada como completada exitosamente',
      application: {
        id: application._id,
        status: application.status,
        completedAt: application.completedAt
      },
      // Información de recompensas
      gamification: {
        pointsAwarded: pointsAwarded,
        achievement: achievementAwarded
      }
    });

  } catch (error) {
    console.error('Error completando adopción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al completar adopción',
      error: error.message
    });
  }
});

// GET /api/adoptions/my-applications - Obtener solicitudes del usuario
router.get('/my-applications', protect, async (req, res) => {
  try {
    const applications = await AdoptionApplication.find({ userId: req.user._id })
      .populate('petId', 'name species breed age gender size image status')
      .sort({ createdAt: -1 });

    const formattedApplications = applications.map(app => ({
      id: app._id,
      pet: app.petId,
      status: app.status,
      appliedAt: app.appliedAt,
      personalInfo: app.personalInfo
    }));

    res.json({
      success: true,
      applications: formattedApplications,
      total: applications.length
    });

  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener solicitudes',
      error: error.message
    });
  }
});

// GET /api/admin/adoptions - Obtener todas las solicitudes (admin)
router.get('/admin/applications', protect, admin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const applications = await AdoptionApplication.find(filter)
      .populate('userId', 'username email profile')
      .populate('petId', 'name species breed image status')
      .populate('assignedTo', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AdoptionApplication.countDocuments(filter);

    res.json({
      success: true,
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Error obteniendo solicitudes admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener solicitudes',
      error: error.message
    });
  }
});

// PUT /api/admin/adoptions/:id/status - Cambiar estado de solicitud (ACTUALIZADO)
router.put('/admin/:id/status', protect, admin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const application = await AdoptionApplication.findById(req.params.id)
      .populate('petId')
      .populate('userId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Guardar el estado anterior para la lógica
    const previousStatus = application.status;

    // Actualizar estado
    application.status = status;
    application.reviewedAt = new Date();
    
    if (notes) {
      application.adminNotes = notes;
    }

    await application.save();

    // Asignar puntos cuando se APRUEBA una adopción
    let pointsAwarded = 0;
    let achievementAwarded = null;

    if (status === 'approved') {
      try {
        const user = await User.findById(application.userId._id);
        if (user) {
          const completedAdoptions = await AdoptionApplication.countDocuments({
            userId: application.userId._id,
            status: 'completed'
          });

          // Si es la primera adopción aprobada (aún no completada)
          const approvedAdoptions = await AdoptionApplication.countDocuments({
            userId: application.userId._id,
            status: 'approved'
          });

          if (approvedAdoptions === 1) {
            // Primera adopción aprobada - 250 puntos
            await user.addPoints(250, {
              name: 'Primera Adopción Aprobada',
              description: 'Tu primera solicitud de adopción fue aprobada',
              icon: '🎉'
            });
            pointsAwarded = 250;
            achievementAwarded = 'first_adoption_approved';
          } else {
            // Adopción aprobada normal - 250 puntos
            await user.addPoints(250);
            pointsAwarded = 250;
          }

          console.log(`🏆 Adopción aprobada: +${pointsAwarded} puntos a usuario ${user.username}`);
        }
      } catch (pointsError) {
        console.error('Error asignando puntos por aprobación:', pointsError);
        // No fallar la operación por error en puntos
      }
    }

    // Lógica de estados de mascota
    if (application.petId) {
      switch (status) {
        case 'approved':
          // Cuando se aprueba, la mascota se marca como ADOPTADA
          application.petId.status = 'adoptado';
          await application.petId.save();
          
          // Rechazar automáticamente otras solicitudes pendientes para la misma mascota
          await AdoptionApplication.updateMany(
            {
              petId: application.petId._id,
              status: { $in: ['pending', 'under_review'] },
              _id: { $ne: application._id }
            },
            {
              status: 'rejected',
              reviewedAt: new Date(),
              rejectionReason: 'Mascota ya fue adoptada por otro usuario'
            }
          );
          break;

        case 'rejected':
          // Solo volver a "disponible" si era la ÚNICA solicitud activa
          if (previousStatus === 'pending' || previousStatus === 'under_review') {
            const activeApplications = await AdoptionApplication.countDocuments({
              petId: application.petId._id,
              status: { $in: ['pending', 'under_review', 'approved'] },
              _id: { $ne: application._id }
            });

            if (activeApplications === 0) {
              application.petId.status = 'disponible';
              await application.petId.save();
            }
          }
          break;

        case 'completed':
          // La mascota ya debería estar como "adoptado", pero por si acaso
          application.petId.status = 'adoptado';
          await application.petId.save();
          break;
      }
    }

    res.json({
      success: true,
      message: `Solicitud ${getStatusText(status)}`,
      application: {
        id: application._id,
        status: application.status,
        petStatus: application.petId?.status
      },
      // Información de puntos si se asignaron
      ...(pointsAwarded > 0 && {
        gamification: {
          pointsAwarded: pointsAwarded,
          achievement: achievementAwarded
        }
      })
    });

  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar estado',
      error: error.message
    });
  }
});

// Helper function (mantener igual)
const getStatusText = (status) => {
  const statusMap = {
    pending: 'marcada como pendiente',
    under_review: 'en revisión',
    approved: 'aprobada',
    rejected: 'rechazada',
    completed: 'completada'
  };
  return statusMap[status] || 'actualizada';
};

export default router;