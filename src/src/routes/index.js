import express from 'express'
import authRoutes from './auth.js'
import userRoutes from './users.js'
import productRoutes from './products.js'
import orderRoutes from './orders.js'
import categoryRoutes from './categories.js'
import cartRoutes from './cart.js'
import favoriteRoutes from './favorites.js'
import materialRoutes from './materials.js'
import refundRoutes from './refunds.js'
import imageRoutes from './images.js'

const router = express.Router()

// API版本和欢迎信息
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '家居电商系统API v1.0',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      categories: '/api/categories',
      cart: '/api/cart',
      favorites: '/api/favorites',
      materials: '/api/materials',
      refunds: '/api/refunds',
      images: '/api/images',
    },
  })
})

// 路由模块
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/orders', orderRoutes)
router.use('/categories', categoryRoutes)
router.use('/cart', cartRoutes)
router.use('/favorites', favoriteRoutes)
router.use('/materials', materialRoutes)
router.use('/refunds', refundRoutes)
router.use('/images', imageRoutes)

export default router

