import express from 'express'
import {
  getOrders,
  getMyOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  updateOrderTracking,
  deleteOrder,
} from '../controllers/orderController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

// 所有路由都需要认证
router.use(authenticate)

// @route   GET /api/orders
// @desc    获取订单列表（管理员）
// @access  Private (Admin)
router.get('/', authorize('admin', 'super_admin'), getOrders)

// @route   GET /api/orders/my-orders
// @desc    获取我的订单列表
// @access  Private
router.get('/my-orders', getMyOrders)

// @route   GET /api/orders/:id
// @desc    获取单个订单
// @access  Private
router.get('/:id', getOrder)

// @route   POST /api/orders
// @desc    创建订单
// @access  Private
router.post('/', createOrder)

// @route   PUT /api/orders/:id/status
// @desc    更新订单状态
// @access  Private (Admin)
router.put('/:id/status', authorize('admin', 'super_admin'), updateOrderStatus)

// @route   PUT /api/orders/:id/tracking
// @desc    更新物流单号
// @access  Private (Admin)
router.put('/:id/tracking', authorize('admin', 'super_admin'), updateOrderTracking)

// @route   DELETE /api/orders/:id
// @desc    删除订单
// @access  Private (Admin)
router.delete('/:id', authorize('admin', 'super_admin'), deleteOrder)

export default router

