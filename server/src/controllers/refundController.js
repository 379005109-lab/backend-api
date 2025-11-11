import Refund from '../models/Refund.js'
import Order from '../models/Order.js'

// 获取退换货列表
export const getAllRefunds = async (req, res, next) => {
  try {
    const { status } = req.query
    const filter = {}

    // 普通用户只能看自己的退款
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      filter.user = req.user._id
    }

    if (status) {
      filter.status = status
    }

    const refunds = await Refund.find(filter)
      .populate('order')
      .populate('user', 'username email')
      .populate('processedBy', 'username')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: refunds,
      message: '获取退换货列表成功',
    })
  } catch (error) {
    next(error)
  }
}

// 获取退换货详情
export const getRefundById = async (req, res, next) => {
  try {
    const refund = await Refund.findById(req.params.id)
      .populate('order')
      .populate('user', 'username email phone')
      .populate('processedBy', 'username')

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: '退换货记录不存在',
      })
    }

    // 检查权限：只有管理员或退款申请人可以查看
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'super_admin' &&
      refund.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: '无权查看此退换货记录',
      })
    }

    res.json({
      success: true,
      data: refund,
      message: '获取退换货详情成功',
    })
  } catch (error) {
    next(error)
  }
}

// 申请退换货
export const createRefund = async (req, res, next) => {
  try {
    const { orderId, reason, description, images, amount } = req.body

    // 验证订单存在且属于当前用户
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在',
      })
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '无权操作此订单',
      })
    }

    // 检查订单状态
    if (order.status !== 'completed' && order.status !== 'shipped') {
      return res.status(400).json({
        success: false,
        message: '只有已完成或已发货的订单才能申请退款',
      })
    }

    // 检查是否已申请过退款
    const existingRefund = await Refund.findOne({
      order: orderId,
      status: { $in: ['pending', 'approved'] },
    })

    if (existingRefund) {
      return res.status(400).json({
        success: false,
        message: '该订单已有待处理的退款申请',
      })
    }

    const refund = await Refund.create({
      order: orderId,
      user: req.user._id,
      reason,
      description,
      images,
      amount: amount || order.totalAmount,
    })

    // 更新订单状态
    order.status = 'refunding'
    await order.save()

    await refund.populate('order')
    await refund.populate('user', 'username email')

    res.status(201).json({
      success: true,
      data: refund,
      message: '退款申请已提交',
    })
  } catch (error) {
    next(error)
  }
}

// 审核退换货
export const reviewRefund = async (req, res, next) => {
  try {
    const { status, rejectReason } = req.body

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '无效的审核状态',
      })
    }

    const refund = await Refund.findById(req.params.id)

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: '退换货记录不存在',
      })
    }

    if (refund.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: '该申请已被处理',
      })
    }

    refund.status = status
    refund.processedBy = req.user._id
    refund.processedAt = new Date()

    if (status === 'rejected' && rejectReason) {
      refund.rejectReason = rejectReason
    }

    await refund.save()

    // 更新订单状态
    const order = await Order.findById(refund.order)
    if (order) {
      if (status === 'approved') {
        // 退款通过，等待完成退款
        order.status = 'refunding'
      } else {
        // 退款拒绝，恢复原状态
        order.status = 'completed'
      }
      await order.save()
    }

    await refund.populate('order')
    await refund.populate('user', 'username email')
    await refund.populate('processedBy', 'username')

    res.json({
      success: true,
      data: refund,
      message: status === 'approved' ? '退款申请已通过' : '退款申请已拒绝',
    })
  } catch (error) {
    next(error)
  }
}

// 完成退款
export const completeRefund = async (req, res, next) => {
  try {
    const refund = await Refund.findById(req.params.id)

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: '退换货记录不存在',
      })
    }

    if (refund.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: '只有已通过的申请才能完成退款',
      })
    }

    refund.status = 'completed'
    await refund.save()

    // 更新订单状态
    const order = await Order.findById(refund.order)
    if (order) {
      order.status = 'refunded'
      await order.save()
    }

    await refund.populate('order')
    await refund.populate('user', 'username email')

    res.json({
      success: true,
      data: refund,
      message: '退款已完成',
    })
  } catch (error) {
    next(error)
  }
}
