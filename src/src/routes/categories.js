import express from 'express'
import {
  getAllCategories,
  getCategoryTree,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryDiscount,
} from '../controllers/categoryController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

// 公开路由
router.get('/', getAllCategories)
router.get('/tree', getCategoryTree)
router.get('/:id', getCategoryById)

// 管理员路由
router.post('/', authenticate, authorize('admin', 'super_admin'), createCategory)
router.put('/:id', authenticate, authorize('admin', 'super_admin'), updateCategory)
router.delete('/:id', authenticate, authorize('admin', 'super_admin'), deleteCategory)
router.put('/:id/discount', authenticate, authorize('admin', 'super_admin'), updateCategoryDiscount)

export default router
