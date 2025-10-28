import AdoptionApplication from '../models/AdoptionApplication.js'
import Pet from '../models/Pet.js'

//Adopciones completadas por mes (BASADO EN MASCOTAS ADOPTADAS)
export const getAdoptionsByMonth = async (req, res) => {
  try {
    console.log('Buscando mascotas adoptadas...')
    
    const result = await Pet.aggregate([
      { $match: { status: 'adoptado' } }, // Solo mascotas adoptadas
      {
        $group: {
          _id: {
            month: { $month: '$updatedAt' }, // Usar updatedAt cuando se marcó como adoptado
            year: { $year: '$updatedAt' }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    console.log('Resultado aggregation:', result)

    // Formato legible para el frontend
    const formatted = result.map(r => ({
      month: `${r._id.month}/${r._id.year}`,
      total: r.total
    }))

    console.log('Adopciones por mes formateadas:', formatted)
    res.json(formatted)
  } catch (err) {
    console.error('Error en getAdoptionsByMonth:', err)
    res.status(500).json({ error: 'Error al obtener adopciones por mes' })
  }
}

//Especies más populares
export const getPopularSpecies = async (req, res) => {
  try {
    const result = await AdoptionApplication.aggregate([
      { $match: { 'preferences.petType': { $ne: null } } },
      {
        $group: {
          _id: '$preferences.petType',
          total: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ])

    const formatted = result.map(r => ({
      species: r._id,
      total: r.total
    }))

    res.json(formatted)
  } catch (err) {
    console.error('Error en getPopularSpecies:', err)
    res.status(500).json({ error: 'Error al obtener especies populares' })
  }
}
