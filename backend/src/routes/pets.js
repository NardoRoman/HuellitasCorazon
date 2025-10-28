import express from 'express';
import Pet from '../models/Pet.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/pets - Obtener todas las mascotas (público)
router.get('/', async (req, res) => {
  try {
    const { species, status, page = 1, limit = 12 } = req.query;
    
    const filter = {};
    if (species && species !== 'all') {
      filter.species = species;
    }
    if (status && status !== 'all') {
      filter.status = status;
    }

    const pets = await Pet.find(filter)
      .select('-createdBy') // Excluir información del creador
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Pet.countDocuments(filter);

    res.json({
      success: true,
      pets,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Error obteniendo mascotas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener mascotas',
      error: error.message
    });
  }
});

// GET /api/pets/:id - Obtener mascota por ID (público)
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .select('-createdBy'); // Excluir información del creador

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    res.json({
      success: true,
      pet
    });

  } catch (error) {
    console.error('Error obteniendo mascota:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al obtener mascota',
      error: error.message
    });
  }
});

// GET /api/pets/species/available - Obtener especies disponibles (público)
router.get('/species/available', async (req, res) => {
  try {
    const species = await Pet.distinct('species', { status: 'disponible' });
    
    res.json({
      success: true,
      species
    });

  } catch (error) {
    console.error('Error obteniendo especies:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener especies',
      error: error.message
    });
  }
});

export default router;