import express from 'express'
import {
  getAllRefunds,
  getRefundById,
  createRefund,
  reviewRefund,
  completeRefund,
} from '../controllers/refundController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

// 所有退换货路由都需要认证
router.use(authenticate)

router.get('/', getAllRefunds)
router.get('/:id', getRefundById)
router.post('/', createRefund)
router.put('/:id/review', authorize('admin', 'super_admin'), reviewRefund)
router.put('/:id/complete', authorize('admin', 'super_admin'), completeRefund)

export default router
