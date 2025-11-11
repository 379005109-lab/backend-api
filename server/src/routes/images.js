import express from 'express'
import {
  uploadImage,
  uploadMultipleImages,
  getAllImages,
  getImageById,
  deleteImage,
  batchDeleteImages,
  updateImage,
} from '../controllers/imageController.js'
import { uploadSingle, uploadMultiple } from '../middleware/upload.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

// 上传单张图片
router.post('/upload', uploadSingle, uploadImage)

// 上传多张图片
router.post('/upload/multiple', uploadMultiple, uploadMultipleImages)

// 获取图片列表
router.get('/', getAllImages)

// 获取单张图片
router.get('/:id', getImageById)

// 更新图片信息
router.put('/:id', authenticate, updateImage)

// 删除图片
router.delete('/:id', authenticate, deleteImage)

// 批量删除图片（管理员）
router.post('/batch-delete', authenticate, authorize('admin', 'super_admin'), batchDeleteImages)

export default router
