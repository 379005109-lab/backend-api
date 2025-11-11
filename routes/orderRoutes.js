const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../controllers/authController');

// 公开路由（前台）
router.post('/', orderController.createOrder); // 创建订单（不需要登录）
router.get('/my', orderController.getMyOrders); // 获取我的订单（通过手机号或登录）

// 需要认证的路由（后台管理）
router.get('/', authenticate, authorize('admin', 'super_admin'), orderController.getOrders);
router.get('/stats', authenticate, authorize('admin', 'super_admin'), orderController.getOrderStats);
router.get('/:id', authenticate, orderController.getOrder);
router.put('/:id/status', authenticate, authorize('admin', 'super_admin'), orderController.updateOrderStatus);

module.exports = router;
