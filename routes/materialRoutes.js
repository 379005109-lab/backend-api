const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/materialController');
const { authenticate } = require('../controllers/authController');

// 素材分类路由（必须在素材路由之前）
router.get('/categories/list', getAllMaterialCategories);
router.get('/categories/tree', getMaterialCategoryTree);
router.post('/categories', authenticate, createMaterialCategory);
router.put('/categories/:id', authenticate, updateMaterialCategory);
router.delete('/categories/:id', authenticate, deleteMaterialCategory);

// 素材路由（特定路由在参数路由之前）
router.get('/stats', authenticate, getMaterialStats);
router.post('/batch-delete', authenticate, batchDeleteMaterials);
router.get('/', getAllMaterials);
router.get('/:id', getMaterialById);
router.post('/', authenticate, createMaterial);
router.put('/:id', authenticate, updateMaterial);
router.delete('/:id', authenticate, deleteMaterial);
router.put('/:id/review', authenticate, reviewMaterial);

module.exports = router;
