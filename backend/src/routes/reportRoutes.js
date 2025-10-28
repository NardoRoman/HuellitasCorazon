import express from 'express'
import { getAdoptionsByMonth, getPopularSpecies } from '../controllers/reportController.js'

const router = express.Router()

router.get('/adoptions-by-month', getAdoptionsByMonth)
router.get('/popular-species', getPopularSpecies)

export default router
