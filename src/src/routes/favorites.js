import express from 'express'
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from '../controllers/favoriteController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// 所有收藏路由都需要认证
router.use(authenticate)

router.get('/', getFavorites)
router.post('/', addFavorite)
router.delete('/:productId', removeFavorite)
router.get('/check/:productId', checkFavorite)

export default router
