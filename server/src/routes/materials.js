import express from 'express'
import {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  batchDeleteMaterials,
  reviewMaterial,
  getMaterialStats,
  getAllMaterialCategories,
  getMaterialCategoryTree,
  createMaterialCategory,
  updateMaterialCategory,
  deleteMaterialCategory,
} from '../controllers/materialController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

// 素材分类路由（必须在素材路由之前）
router.get('/categories/list', getAllMaterialCategories)
router.get('/categories/tree', getMaterialCategoryTree)
router.post('/categories', authenticate, authorize('admin', 'super_admin'), createMaterialCategory)
router.put('/categories/:id', authenticate, authorize('admin', 'super_admin'), updateMaterialCategory)
router.delete('/categories/:id', authenticate, authorize('admin', 'super_admin'), deleteMaterialCategory)

// 素材路由（特定路由在参数路由之前）
router.get('/stats', authenticate, authorize('admin', 'super_admin'), getMaterialStats)
router.post('/batch-delete', authenticate, authorize('admin', 'super_admin'), batchDeleteMaterials)
router.get('/', getAllMaterials)
router.get('/:id', getMaterialById)
router.post('/', authenticate, createMaterial)
router.put('/:id', authenticate, updateMaterial)
router.delete('/:id', authenticate, deleteMaterial)
router.put('/:id/review', authenticate, authorize('admin', 'super_admin'), reviewMaterial)

export default router
