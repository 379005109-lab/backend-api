import express from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/products
// @desc    获取商品列表
// @access  Public
router.get('/', getProducts)

// @route   GET /api/products/:id
// @desc    获取单个商品
// @access  Public
router.get('/:id', getProduct)

// 以下路由需要管理员权限
router.use(authenticate, authorize('admin', 'super_admin'))

// @route   POST /api/products
// @desc    创建商品
// @access  Private (Admin)
router.post('/', createProduct)

// @route   PUT /api/products/:id
// @desc    更新商品
// @access  Private (Admin)
router.put('/:id', updateProduct)

// @route   DELETE /api/products/:id
// @desc    删除商品
// @access  Private (Admin)
router.delete('/:id', deleteProduct)

export default router

