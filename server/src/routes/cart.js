import express from 'express'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// 所有购物车路由都需要认证
router.use(authenticate)

router.get('/', getCart)
router.post('/items', addToCart)
router.put('/items/:itemId', updateCartItem)
router.delete('/items/:itemId', removeCartItem)
router.delete('/clear', clearCart)

export default router
