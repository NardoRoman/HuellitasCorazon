import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Logros predefinidos para gamificación
const ACHIEVEMENTS = {
  FIRST_LOGIN: {
    name: 'Primer Login',
    description: '¡Bienvenido a Huellitas!',
    icon: '🎉',
    points: 10
  },
  PROFILE_COMPLETE: {
    name: 'Perfil Completo',
    description: 'Completaste tu perfil',
    icon: '📝',
    points: 20
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El usuario o email ya existe'
      });
    }

    const user = await User.create({
      username,
      email,
      password
    });

    const token = generateToken(user._id);

    user.password = undefined;

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        points: user.points,
        level: user.level,
        achievements: user.achievements
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // GAMIFICACIÓN MEJORADA - LOGIN DIARIO
    let pointsAdded = 0;
    let dailyLoginPoints = 0;
    const today = new Date().toDateString();
    const lastLoginDate = user.lastLogin ? new Date(user.lastLogin).toDateString() : null;

    // 1. Primer login - 10 puntos
    if (user.loginCount === 0) {
      pointsAdded += ACHIEVEMENTS.FIRST_LOGIN.points;
      await user.addPoints(ACHIEVEMENTS.FIRST_LOGIN.points, ACHIEVEMENTS.FIRST_LOGIN);
    }

    // 2. Login diario - 5 puntos (solo una vez por día)
    if (lastLoginDate !== today) {
      dailyLoginPoints = 5;
      pointsAdded += dailyLoginPoints;
      await user.addPoints(dailyLoginPoints);
    }

    // Actualizar contadores
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    const token = generateToken(user._id);
    user.password = undefined;

    // Mensaje personalizado según puntos ganados
    let message = 'Login exitoso';
    if (pointsAdded > 0) {
      message = `¡Login exitoso! `;
      if (dailyLoginPoints > 0) {
        message += `Ganaste ${dailyLoginPoints} puntos por login diario `;
      }
      if (user.loginCount === 1) {
        message += `y ${ACHIEVEMENTS.FIRST_LOGIN.points} puntos por primer login`;
      }
    }

    res.json({
      success: true,
      message: message.trim(),
      token,
      pointsEarned: pointsAdded,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        points: user.points,
        level: user.level, 
        achievements: user.achievements,
        loginCount: user.loginCount,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el login',
      error: error.message
    });
  }
};

// Agregar puntos por actividades
export const addPoints = async (req, res) => {
  try {
    const { points, activity } = req.body;
    const user = await User.findById(req.user._id);
    
    await user.addPoints(points);
    
    res.json({
      success: true,
      message: `¡Ganaste ${points} puntos!`,
      newPoints: user.points,
      newLevel: user.level
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al agregar puntos',
      error: error.message
    });
  }
};

// Obtener perfil completo del usuario
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        points: user.points || 0,
        level: Math.floor((user.points || 0) / 100) + 1,
        adoptedPets: 0, 
        createdAt: user.createdAt,
        profile: user.profile || {}
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

// Actualizar perfil de usuario
export const updateProfile = async (req, res) => {
  try {
    const { username, email, phone, preferences } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar campos permitidos
    if (username) user.username = username;
    if (email) user.email = email;
    
    // Crear objeto profile si no existe
    if (!user.profile) user.profile = {};
    
    if (phone) user.profile.phone = phone;
    if (preferences) user.profile.preferences = {
      ...user.profile.preferences,
      ...preferences
    };

    await user.save();

    res.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        points: user.points,
        level: Math.floor((user.points || 0) / 100) + 1,
        adoptedPets: 0,
        createdAt: user.createdAt,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario o email ya existe'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};