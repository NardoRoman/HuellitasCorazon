import express from 'express';
import { createVisionClient } from '../config/vision-config.js'; // ← CAMBIAR
import Pet from '../models/Pet.js';
import { protect } from '../middleware/auth.js';

const client = createVisionClient(); // ← CAMBIAR

const router = express.Router();

// LISTA AMPLIADA DE RAZAS (SOLO ESPECIES QUE MANEJAMOS)
const BREED_KEYWORDS = {
  dogs: [
    // Razas pequeñas
    'pug', 'chihuahua', 'yorkshire', 'maltese', 'shih tzu', 'pomeranian', 
    'bichon frise', 'cavalier king charles', 'papillon', 'pekinese', 'havanese',
    'miniature pinscher', 'italian greyhound', 'dachshund', 'corgi', 'scottish terrier',
    'west highland white', 'jack russell terrier', 'border terrier', 'cairn terrier',
    
    // Razas medianas
    'beagle', 'bulldog', 'french bulldog', 'boston terrier', 'cocker spaniel',
    'brittany', 'shetland sheepdog', 'australian cattle dog', 'whippet', 'shar pei',
    'basenji', 'samoyed', 'english bulldog', 'american bulldog', 'boxer', 'bull terrier',
    
    // Razas grandes
    'labrador', 'retriever', 'golden retriever', 'german shepherd', 'rottweiler',
    'doberman', 'siberian husky', 'alaskan malamute', 'bernese mountain', 'great dane',
    'saint bernard', 'akita', 'mastiff', 'bloodhound', 'weimaraner', 'vizsla',
    'rhodesian ridgeback', 'newfoundland', 'leonberger', 'pyrenean mountain',
    
    // Razas de pastoreo
    'border collie', 'australian shepherd', 'belgian malinois', 'old english sheepdog',
    'collie', 'german shepherd', 'australian kelpie', 'bouvier des flandres',
    
    // Razas de caza
    'pointer', 'setter', 'spaniel', 'weimaraner', 'vizsla', 'retriever'
  ],
  cats: [
    // Pelo corto
    'siamese', 'british shorthair', 'russian blue', 'burmese', 'abyssinian', 
    'oriental', 'tonkinese', 'exotic shorthair', 'devon rex', 'cornish rex',
    'american shorthair', 'bombay', 'egyptian mau', 'ocicat', 'singapura',
    
    // Pelo largo
    'persian', 'maine coon', 'ragdoll', 'birman', 'himalayan', 'somali',
    'turkish angora', 'norwegian forest', 'siberian', 'balinese',
    
    // Razas especiales
    'sphynx', 'scottish fold', 'selkirk rex', 'peterbald', 'laperm'
  ],
  birds: [
    // Loros y cotorras
    'parrot', 'african grey', 'amazon parrot', 'cockatoo', 'macaw', 'conure',
    'lorikeet', 'parakeet', 'budgerigar', 'lovebird', 'parrotlet', 'pionus',
    'quaker parrot', 'eclectus', 'senegal parrot', 'caique', 'cockatiel',
    
    // Aves cantoras
    'canary', 'finch', 'zebra finch', 'gouldian finch', 'society finch',
    
    // Otras aves
    'dove', 'pigeon', 'cock', 'hen', 'poultry'
  ],
  rabbits: [
    'holland lop', 'mini lop', 'french lop', 'english lop', 'rex', 'mini rex',
    'lionhead', 'netherland dwarf', 'polish', 'hotot', 'flemish giant', 
    'californian', 'new zealand', 'angora', 'himalayan', 'dutch', 'harlequin',
    'chinchilla', 'belier', 'raza gigante', 'conejo enano'
  ]
};

// Todas las razas en un solo array para búsqueda
const ALL_BREEDS = [
  ...BREED_KEYWORDS.dogs,
  ...BREED_KEYWORDS.cats, 
  ...BREED_KEYWORDS.birds,
  ...BREED_KEYWORDS.rabbits
];

// Traducciones de especies
const SPECIES_TRANSLATIONS = {
  'dog': 'Perro',
  'puppy': 'Perro', 
  'canine': 'Perro',
  'perro': 'Perro',
  'cachorro': 'Perro',
  'cat': 'Gato',
  'kitten': 'Gato',
  'feline': 'Gato', 
  'gato': 'Gato',
  'gatito': 'Gato',
  'rabbit': 'Conejo',
  'bunny': 'Conejo',
  'conejo': 'Conejo',
  'bird': 'Ave',
  'parrot': 'Loro',
  'cockatiel': 'Cacatúa',
  'budgerigar': 'Periquito',
  'canary': 'Canario',
  'finch': 'Pinzón',
  'cockatoo': 'Cacatúa',
  'macaw': 'Guacamayo',
  'lovebird': 'Inseparable',
  'parakeet': 'Periquito',
  'african grey': 'Loro Gris Africano',
  'amazon parrot': 'Loro Amazónico',
  'conure': 'Aratinga',
  'lorikeet': 'Lori',
  'ave': 'Ave',
  'pájaro': 'Ave'
};

// Palabras que NO son razas (para excluir)
const NON_BREED_KEYWORDS = new Set([
  // Colores
  'black', 'white', 'brown', 'gray', 'grey', 'orange', 'golden', 'yellow', 'red', 
  'blue', 'cream', 'silver', 'tan', 'brindle', 'merle', 'dark', 'light',
  
  // Partes del cuerpo
  'collar', 'snout', 'ears', 'tail', 'eyes', 'nose', 'paw', 'fur', 'coat', 'hair',
  'short', 'long', 'fluffy', 'smooth', 'rough', 'curly', 'wavy', 'feathers', 'beak',
  'wings', 'plumage', 'crest', 'muzzle', 'whiskers', 'teeth', 'tongue', 'claw',
  
  // Accesorios y objetos
  'dog collar', 'pet supply', 'working animal', 'terrestrial animal', 'toy',
  'leash', 'harness', 'bed', 'food', 'bowl', 'bone',
  
  // Términos generales
  'vertebrate', 'carnivores', 'animal', 'pet', 'domestic', 'mammal', 'fauna',
  'small', 'medium', 'large', 'giant', 'tiny', 'adult', 'baby', 'young',
  
  // Ambientes
  'grass', 'yard', 'garden', 'house', 'home', 'indoor', 'outdoor'
]);

// FUNCIÓN SIMPLIFICADA PARA CATEGORIZAR
const categorizeLabel = (description) => {
  const desc = description.toLowerCase().trim();
  
  // 1. Excluir palabras que NO son razas
  if (NON_BREED_KEYWORDS.has(desc)) {
    return 'other';
  }
  
  // 2. Detectar especie
  if (desc === 'dog' || desc === 'puppy' || desc === 'canine' || desc === 'perro') {
    return 'species';
  }
  if (desc === 'cat' || desc === 'kitten' || desc === 'feline' || desc === 'gato') {
    return 'species';
  }
  if (desc === 'rabbit' || desc === 'bunny' || desc === 'conejo') {
    return 'species';
  }
  if (desc.includes('bird') || desc.includes('parrot') || desc.includes('cockatiel') || 
      desc.includes('budgerigar') || desc.includes('canary') || desc.includes('finch') ||
      desc.includes('cockatoo') || desc.includes('macaw') || desc.includes('lovebird') ||
      desc.includes('parakeet') || desc === 'ave' || desc === 'pájaro') {
    return 'species';
  }
  
  // 3. Verificar si es una raza válida (búsqueda exacta o parcial)
  for (const breed of ALL_BREEDS) {
    if (desc === breed) {
      return 'breed';
    }
    // Coincidencia parcial solo si es una palabra completa
    if (desc.includes(breed) && (desc === breed || desc.startsWith(breed + ' ') || desc.endsWith(' ' + breed))) {
      return 'breed';
    }
  }
  
  return 'other';
};

// FUNCIÓN SIMPLIFICADA PARA EXTRAER SUGERENCIAS
const extractPetSuggestions = (labels) => {
  const suggestions = {
    species: '',
    breed: '',
    confidence: 0
  };

  console.log('Analizando etiquetas para especie y raza...');

  // Filtrar solo labels de especie y raza
  const relevantLabels = labels.filter(label => 
    label.category === 'species' || label.category === 'breed'
  );

  console.log('Etiquetas relevantes filtradas:', relevantLabels);

  // 1. Buscar ESPECIE (tomar la de mayor confianza)
  const speciesLabels = relevantLabels.filter(label => label.category === 'species');
  if (speciesLabels.length > 0) {
    const bestSpecies = speciesLabels.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
    suggestions.species = SPECIES_TRANSLATIONS[bestSpecies.description.toLowerCase()] || bestSpecies.description;
    console.log(`🐾 Especie detectada: ${suggestions.species} (${bestSpecies.confidence}%)`);
  }

  // 2. Buscar RAZA (solo razas válidas de nuestro listado)
  const breedLabels = relevantLabels.filter(label => label.category === 'breed');
  if (breedLabels.length > 0) {
    // Ordenar por confianza y tomar la mejor
    breedLabels.sort((a, b) => b.confidence - a.confidence);
    
    for (const breedLabel of breedLabels) {
      const breedName = breedLabel.description.toLowerCase();
      
      // Verificar que la raza esté en nuestro listado
      if (ALL_BREEDS.some(breed => breed === breedName)) {
        suggestions.breed = formatBreedName(breedLabel.description);
        console.log(`Raza detectada: ${suggestions.breed} (${breedLabel.confidence}%)`);
        break; // Tomar solo la raza con mayor confianza que sea válida
      }
    }
  }

  // 3. Calcular confianza promedio
  const confidenceLabels = relevantLabels.filter(label => 
    label.category === 'species' || label.category === 'breed'
  );
  
  if (confidenceLabels.length > 0) {
    suggestions.confidence = Math.round(
      confidenceLabels.reduce((sum, label) => sum + label.confidence, 0) / confidenceLabels.length
    );
  }

  console.log('Resultado final:', suggestions);
  return suggestions;
};

// Función para formatear nombres de raza
const formatBreedName = (breedName) => {
  return breedName.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// OBTENER TODAS LAS MASCOTAS
router.get('/pets', protect, async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: pets.length,
      pets: pets.map(pet => ({
        id: pet._id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        size: pet.size,
        description: pet.description,
        status: pet.status,
        image: pet.image,
        createdAt: pet.createdAt
      }))
    });
  } catch (error) {
    console.error('Error obteniendo mascotas:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo mascotas'
    });
  }
});

// CREAR NUEVA MASCOTA
router.post('/pets', protect, async (req, res) => {
  try {
    const {
      name, species, breed, age, gender, size, 
      description, status, image
    } = req.body;

    // Validar campos requeridos
    const requiredFields = ['name', 'species', 'breed', 'age', 'gender', 'size', 'description', 'image'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Faltan campos requeridos: ${missingFields.join(', ')}`
      });
    }

    const newPet = new Pet({
      name,
      species,
      breed,
      age,
      gender,
      size,
      description,
      status: status || 'disponible',
      image,
      createdBy: req.user.id
    });

    await newPet.save();

    res.status(201).json({
      success: true,
      message: 'Mascota creada exitosamente',
      pet: {
        id: newPet._id,
        name: newPet.name,
        species: newPet.species,
        breed: newPet.breed,
        age: newPet.age,
        gender: newPet.gender,
        size: newPet.size,
        description: newPet.description,
        status: newPet.status,
        image: newPet.image,
        createdAt: newPet.createdAt
      }
    });

  } catch (error) {
    console.error('Error creando mascota:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creando mascota',
      error: error.message
    });
  }
});

// ACTUALIZAR DATOS DE UNA MASCOTA
router.put('/pets/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, species, breed, age, gender, size, 
      description, status, image
    } = req.body;

    const updatedPet = await Pet.findByIdAndUpdate(
      id,
      {
        name, species, breed, age, gender, size, 
        description, status, image
      },
      { new: true, runValidators: true }
    );

    if (!updatedPet) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Mascota actualizada exitosamente',
      pet: {
        id: updatedPet._id,
        name: updatedPet.name,
        species: updatedPet.species,
        breed: updatedPet.breed,
        age: updatedPet.age,
        gender: updatedPet.gender,
        size: updatedPet.size,
        description: updatedPet.description,
        status: updatedPet.status,
        image: updatedPet.image,
        createdAt: updatedPet.createdAt
      }
    });

  } catch (error) {
    console.error('Error actualizando mascota:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error actualizando mascota',
      error: error.message
    });
  }
});

// ELIMINAR MASCOTA
router.delete('/pets/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPet = await Pet.findByIdAndDelete(id);

    if (!deletedPet) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Mascota eliminada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error eliminando mascota:', error);
    res.status(500).json({
      success: false,
      message: 'Error eliminando mascota',
      error: error.message
    });
  }
});

// ANALIZAR IMAGEN DE LA MASCOTA
router.post('/analyze-image', protect, async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere imageUrl'
      });
    }

    console.log('Analizando imagen:', imageUrl);

    const [result] = await client.labelDetection(imageUrl);
    const labels = result.labelAnnotations || [];

    console.log('Etiquetas brutas recibidas:', labels.map(l => ({
      description: l.description,
      score: l.score
    })));

    // Filtrar y categorizar etiquetas
    const relevantLabels = labels
      .filter(label => label.score > 0.7) // Solo etiquetas con buena confianza
      .map(label => ({
        description: label.description,
        confidence: Math.round(label.score * 100),
        category: categorizeLabel(label.description)
      }));

    console.log('Etiquetas categorizadas:', relevantLabels);

    res.json({
      success: true,
      suggestions: extractPetSuggestions(relevantLabels),
      rawLabels: relevantLabels.filter(l => l.category !== 'other') // Solo mostrar relevantes
    });

  } catch (error) {
    console.error('Error en análisis de imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error analizando imagen',
      error: error.message
    });
  }
});

export default router;