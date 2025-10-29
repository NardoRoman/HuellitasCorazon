import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import Pet from './models/Pet.js';

// Importar rutas
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js'; 
import adminRoutes from './routes/admin.js';
import eventRoutes from './routes/events.js';
import adoptionRoutes from './routes/adoptions.js';
import petRoutes from './routes/pets.js';
import reportRoutes from './routes/reportRoutes.js'

dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://huellitascorazon.netlify.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/events', eventRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/reports', reportRoutes)

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'API Huellitas con Corazón funcionando!',
    timestamp: new Date().toISOString()
  });
});

// ENDPOINT PARA OBTENER LAS MASCOTAS EN LA BASE DE DATOS
app.get('/api/pets', async (req, res) => {
  try {
    const pets = await Pet.find({ status: 'disponible' }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      pets: pets.map(pet => ({
        id: pet._id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        size: pet.size,
        gender: pet.gender,
        description: pet.description,
        status: pet.status,
        image: pet.image,
        createdAt: pet.createdAt
      }))
    });
  } catch (error) {
    console.error('Error obteniendo mascotas públicas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo mascotas'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});