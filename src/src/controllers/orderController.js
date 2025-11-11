import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { sendOrderNotificationEmail } from '../services/emailService.js'
import User from '../models/User.js'

// @desc    获取订单列表（管理员）
// @route   GET /api/orders
// @access  Private (Admin)
export const getOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
      endDate,
    } = req.query

    // 构建查询条件
    const query = {}

    if (status) query.status = status

    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }

    // 分页查询
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const orders = await Order.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('user', 'username email phone')
      .populate('items.product', 'name images')
      .lean()

    // 过滤掉已删除商品的订单项，确保数据安全
    const safeOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        productName: item.productName || (item.product?.name) || '商品已下架',
        productImage: item.productImage || (item.product?.images?.[0]) || '',
        sku: item.sku || { color: '', material: '' }
      }))
    }))

    const total = await Order.countDocuments(query)

    res.json({
      success: true,
      data: safeOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    获取我的订单列表
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const { status } = req.query

    // 构建查询条件 - 只查询当前用户的订单
    const query = { user: req.user._id }

    if (status) query.status = status

    // 查询订单
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'username email phone')
      .populate('items.product', 'name images')
      .lean()

    // 过滤掉已删除商品的订单项，确保数据安全
    const safeOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        productName: item.productName || (item.product?.name) || '商品已下架',
        productImage: item.productImage || (item.product?.images?.[0]) || '',
        sku: item.sku || { color: '', material: '' }
      })),
      shippingAddress: order.shippingAddress || { name: '未填写', phone: '' }
    }))

    res.json({
      success: true,
      data: safeOrders,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    获取单个订单
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email phone')
      .populate('items.product', 'name images')
      .lean()

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在',
      })
    }

    // 过滤掉已删除商品的订单项，确保数据安全
    const safeOrder = {
      ...order,
      items: order.items.map(item => ({
        ...item,
        productName: item.productName || (item.product?.name) || '商品已下架',
        productImage: item.productImage || (item.product?.images?.[0]) || '',
        sku: item.sku || { color: '', material: '' }
      }))
    }

    // 普通用户只能查看自己的订单
    if (
      !['admin', 'super_admin'].includes(req.user.role) &&
      safeOrder.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: '权限不足',
      })
    }

    res.json({
      success: true,
      data: safeOrder,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    创建订单
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body

    // 验证必填字段
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: '订单商品列表不能为空',
      })
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: '收货信息不能为空',
      })
    }

    if (!shippingAddress.name || !shippingAddress.phone) {
      return res.status(400).json({
        success: false,
        message: '收货信息不完整，请填写收货人姓名和联系电话',
      })
    }

    // 验证地址（新格式或旧格式）
    const hasAddress = shippingAddress.address || 
      (shippingAddress.province && shippingAddress.city && shippingAddress.district && shippingAddress.detail)
    
    if (!hasAddress) {
      return res.status(400).json({
        success: false,
        message: '收货地址不能为空',
      })
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: '支付方式不能为空',
      })
    }

    // 验证商品和计算总价
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      // 前端可能传递 product 或 productId
      const productId = item.product || item.productId
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: `商品ID缺失`,
        })
      }
      
      const product = await Product.findById(productId)
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `商品不存在: ${productId}`,
        })
      }

      // 查找对应的SKU（前端可能传递 sku._id 或 skuId）
      const skuId = item.skuId || item.sku?._id
      if (!skuId) {
        return res.status(400).json({
          success: false,
          message: `SKU ID缺失，商品：${product.name}`,
        })
      }
      
      // 将skuId转换为字符串进行比较（处理ObjectId和字符串的匹配）
      const skuIdStr = skuId.toString()
      const sku = product.skus.find(
        (s) => s._id.toString() === skuIdStr
      )
      if (!sku) {
        return res.status(404).json({
          success: false,
          message: `SKU不存在，商品：${product.name}，SKU ID：${skuIdStr}`,
        })
      }

      // 检查库存
      if (sku.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `商品 ${product.name} 库存不足`,
        })
      }

      // 使用前端传递的价格（包含材质升级价格），如果没有则使用SKU价格
      const itemPrice = item.price !== undefined && item.price > 0 ? item.price : (sku.price || 0)
      if (!itemPrice || itemPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: `商品 ${product.name} 价格无效`,
        })
      }
      
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `商品 ${product.name} 数量无效`,
        })
      }
      
      const itemTotal = itemPrice * item.quantity
      totalAmount += itemTotal

      orderItems.push({
        product: product._id,
        productName: item.productName || product.name,
        productImage: item.productImage || (product.images && product.images.length > 0 ? product.images[0] : ''),
        sku: {
          color: sku.color || '',
          material: sku.material || '',
        },
        quantity: item.quantity,
        price: itemPrice, // 使用前端传递的价格（包含材质升级价格）
      })

      // 减少库存
      sku.stock -= item.quantity
      product.sales += item.quantity
      await product.save()
    }

    // 创建订单
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes,
    })

    // 填充用户信息（用于邮件通知）
    await order.populate('user', 'username email phone')

    // 发送邮件通知（异步，不阻塞订单创建）
    sendOrderNotificationEmail({
      ...order.toObject(),
      user: order.user,
    }).catch(error => {
      console.error('发送订单通知邮件失败（不影响订单创建）:', error)
    })

    res.status(201).json({
      success: true,
      message: '订单创建成功',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    更新订单状态
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber } = req.body

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在',
      })
    }

    order.status = status

    if (status === 'paid' && !order.paidAt) {
      order.paidAt = new Date()
    }

    if (status === 'shipped') {
      order.shippedAt = new Date()
      if (trackingNumber) {
        order.trackingNumber = trackingNumber
      }
    }

    if (status === 'completed' && !order.completedAt) {
      order.completedAt = new Date()
    }

    await order.save()

    res.json({
      success: true,
      message: '订单状态已更新',
      data: order,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    删除订单
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在',
      })
    }

    await order.deleteOne()

    res.json({
      success: true,
      message: '订单已删除',
    })
  } catch (error) {
    next(error)
  }
}

