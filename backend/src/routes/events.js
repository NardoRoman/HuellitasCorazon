import express from 'express';
import Event from '../models/Event.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los eventos (público) 
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ status: 'active' })
      .sort({ date: 1 })
      .select('-__v');
    
    // Formatear los datos para el frontend
    const formattedEvents = events.map(event => {
      const formatted = event.formattedDate;
      
      // Verificar si el usuario actual está registrado (si hay token)
      let isRegistered = false;
      if (req.user) {
        isRegistered = event.isUserRegistered(req.user._id);
      }
      
      return {
        id: event._id,
        title: event.title,
        type: event.type,
        typeText: event.typeText,
        description: event.description,
        fullDescription: event.fullDescription,
        day: formatted.day,
        month: formatted.month,
        year: formatted.year,
        fullDate: formatted.fullDate,
        time: event.time,
        location: event.location,
        participants: event.confirmedParticipants, 
        capacity: event.capacity,
        organizer: event.organizer,
        image: event.image,
        highlighted: event.highlighted,
        requirements: event.requirements,
        registered: isRegistered 
      };
    });

    res.json({
      success: true,
      events: formattedEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos',
      error: error.message
    });
  }
});

// Obtener eventos destacados
router.get('/featured', async (req, res) => {
  try {
    const featuredEvents = await Event.find({ 
      highlighted: true, 
      status: 'active',
      date: { $gte: new Date() }
    })
    .sort({ date: 1 })
    .limit(3);

    const formattedEvents = featuredEvents.map(event => {
      const formatted = event.formattedDate;
      
      let isRegistered = false;
      if (req.user) {
        isRegistered = event.isUserRegistered(req.user._id);
      }
      
      return {
        id: event._id,
        title: event.title,
        type: event.type,
        typeText: event.typeText,
        description: event.description,
        day: formatted.day,
        month: formatted.month,
        time: event.time,
        location: event.location,
        participants: event.confirmedParticipants,
        image: event.image,
        highlighted: event.highlighted,
        registered: isRegistered
      };
    });

    res.json({
      success: true,
      events: formattedEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos destacados',
      error: error.message
    });
  }
});

// POST /:id/register 
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    if (event.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Este evento no está disponible para registro'
      });
    }

    if (event.date < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'No puedes registrarte a un evento que ya pasó'
      });
    }

    if (event.isUserRegistered(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Ya estás registrado en este evento'
      });
    }

    if (event.confirmedParticipants >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'El evento está lleno, no hay cupos disponibles'
      });
    }

    event.registrations.push({
      userId: req.user._id,
      guests: req.body.guests || 0
    });

    await event.save();

    // Añadir 20 puntos (sin afectar respuesta existente)
    try {
      const User = await import('../models/User.js').then(module => module.default);
      const user = await User.findById(req.user._id);
      if (user) {
        await user.addPoints(20, {
          name: 'Registro a Evento',
          description: `Te registraste a: ${event.title}`,
          icon: '🎫'
        });
        console.log(`+20 puntos por registro a evento: ${event.title}`);
      }
    } catch (pointsError) {
      console.error('Error asignando puntos por registro a evento:', pointsError);
    }

    res.json({
      success: true,
      message: '¡Registro exitoso! Te esperamos en el evento',
      participants: event.confirmedParticipants
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar en el evento',
      error: error.message
    });
  }
});

// DELETE /:id/unregister - MODIFICADO para restar puntos sin afectar flujo
router.delete('/:id/unregister', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    const registrationIndex = event.registrations.findIndex(reg => 
      reg.userId.equals(req.user._id) && reg.status === 'confirmed'
    );

    if (registrationIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'No estás registrado en este evento'
      });
    }

    event.registrations[registrationIndex].status = 'cancelled';
    await event.save();

    // Restar 20 puntos
    try {
      const User = await import('../models/User.js').then(module => module.default);
      const user = await User.findById(req.user._id);
      if (user) {
        await user.addPoints(-20, {
          name: 'Cancelación de Evento',
          description: `Cancelaste registro a: ${event.title}`,
          icon: '❌'
        });
        console.log(`-20 puntos por cancelación de evento: ${event.title}`);
      }
    } catch (pointsError) {
      console.error('Error restando puntos por cancelación:', pointsError);
    }

    res.json({
      success: true,
      message: 'Registro cancelado exitosamente',
      participants: event.confirmedParticipants
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cancelar registro',
      error: error.message
    });
  }
});

// Compartir evento (+15 puntos)
router.post('/:id/share', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    // Añadir 15 puntos por compartir
    try {
      const User = await import('../models/User.js').then(module => module.default);
      const user = await User.findById(req.user._id);
      if (user) {
        await user.addPoints(15, {
          name: 'Compartir Evento',
          description: `Compartiste: ${event.title}`,
          icon: '📤'
        });
        console.log(`+15 puntos por compartir evento: ${event.title}`);
      }
    } catch (pointsError) {
      console.error('Error asignando puntos por compartir evento:', pointsError);
    }

    res.json({
      success: true,
      message: '¡Gracias por compartir el evento!',
      pointsEarned: 15
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al procesar compartir',
      error: error.message
    });
  }
});

// NUEVO: Verificar estado de registro
router.get('/:id/check-registration', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    const isRegistered = event.isUserRegistered(req.user._id);

    res.json({
      success: true,
      registered: isRegistered,
      participants: event.confirmedParticipants,
      capacity: event.capacity
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al verificar registro',
      error: error.message
    });
  }
});

// Crear evento (admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      date: new Date(req.body.date) // Convertir string a Date
    };

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      event: {
        id: event._id,
        ...eventData
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear evento',
      error: error.message
    });
  }
});

// Actualizar evento (admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const eventData = { ...req.body };
    if (req.body.date) {
      eventData.date = new Date(req.body.date);
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      eventData,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Evento actualizado exitosamente',
      event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar evento',
      error: error.message
    });
  }
});

// Eliminar evento (admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar evento',
      error: error.message
    });
  }
});

// Obtener eventos del usuario registrado 
router.get('/my-events', protect, async (req, res) => {
  try {
    const events = await Event.find({ 
      'registrations.userId': req.user._id,
      'registrations.status': 'confirmed',
      status: 'active'
    })
    .sort({ date: 1 })
    .select('-__v');
    
    const formattedEvents = events.map(event => {
      const formatted = event.formattedDate;
      const userRegistration = event.registrations.find(reg => 
        reg.userId.equals(req.user._id) && reg.status === 'confirmed'
      );
      
      return {
        id: event._id,
        title: event.title,
        type: event.type,
        typeText: event.typeText,
        description: event.description,
        fullDescription: event.fullDescription,
        day: formatted.day,
        month: formatted.month,
        year: formatted.year,
        fullDate: formatted.fullDate,
        time: event.time,
        location: event.location,
        participants: event.confirmedParticipants,
        capacity: event.capacity,
        organizer: event.organizer,
        image: event.image,
        highlighted: event.highlighted,
        requirements: event.requirements,
        registered: true,
        registrationDate: userRegistration.registeredAt,
        guests: userRegistration.guests || 0
      };
    });

    res.json({
      success: true,
      events: formattedEvents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener mis eventos',
      error: error.message
    });
  }
});

export default router;