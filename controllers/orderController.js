const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * 创建订单
 */
exports.createOrder = async (req, res) => {
  try {
    // 记录接收到的数据用于调试
    console.log('收到订单创建请求，请求体:', JSON.stringify(req.body, null, 2));
    
    // 兼容两种数据格式
    let {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      items,
      paymentMethod,
      customerNote,
      notes
    } = req.body;

    // 如果使用新格式（shippingAddress.name/phone），转换为旧格式
    if (!customerName && shippingAddress?.name) {
      customerName = shippingAddress.name;
    }
    if (!customerPhone && shippingAddress?.phone) {
      customerPhone = shippingAddress.phone;
    }
    
    // 兼容 notes 字段（前端可能用 notes 而不是 customerNote）
    if (!customerNote && notes) {
      customerNote = notes;
    }

    // 记录提取的字段
    console.log('提取的字段:', {
      customerName,
      customerPhone,
      itemsCount: items ? items.length : 0,
      hasItems: !!items
    });

    // 验证必填字段
    if (!customerName || !customerPhone || !items || items.length === 0) {
      console.log('验证失败:', {
        hasCustomerName: !!customerName,
        hasCustomerPhone: !!customerPhone,
        hasItems: !!items,
        itemsLength: items ? items.length : 0
      });
      return res.status(400).json({
        success: false,
        message: '请填写完整的订单信息'
      });
    }

    // 计算订单金额
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      // 兼容前端可能传递 product 或 productId
      const productId = item.product || item.productId;
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: '商品ID缺失'
        });
      }

      // 验证商品
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `商品不存在: ${productId}`
        });
      }

      // 检查库存
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `商品 ${product.productName} 库存不足`
        });
      }

      const itemSubtotal = (product.discountPrice || product.listPrice) * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product._id,
        productName: product.productName,
        model: product.model,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        price: product.discountPrice || product.listPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        sku: item.sku
      });
    }

    // 计算运费和总价
    const shippingFee = subtotal >= 1000 ? 0 : 50; // 满1000免运费
    const total = subtotal + shippingFee;

    // 生成订单号
    const orderNumber = Order.generateOrderNumber();

    // 标准化收货地址格式（兼容新旧格式）
    let normalizedAddress = shippingAddress;
    if (shippingAddress && !shippingAddress.province && shippingAddress.address) {
      // 前端发送的是简化格式，转换为标准格式
      normalizedAddress = {
        province: '',  // 可以从 address 中解析，但这里简化处理
        city: '',
        district: '',
        address: shippingAddress.address,
        zipCode: shippingAddress.zipCode || ''
      };
    }

    // 创建订单
    const order = await Order.create({
      orderNumber,
      userId: req.user ? req.user._id : null,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress: normalizedAddress,
      items: orderItems,
      subtotal,
      shippingFee,
      total,
      paymentMethod: paymentMethod || 'cod',
      customerNote
    });

    // 扣减库存
    for (const item of items) {
      const productId = item.product || item.productId;
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: -item.quantity, sales: item.quantity }
      });
    }

    res.json({
      success: true,
      data: order,
      message: '订单创建成功'
    });
  } catch (error) {
    console.error('创建订单失败:', error);
    res.status(500).json({
      success: false,
      message: '创建订单失败',
      error: error.message
    });
  }
};

/**
 * 获取订单列表（后台管理）
 */
exports.getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      orderNumber,
      customerName,
      startDate,
      endDate
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (orderNumber) {
      query.orderNumber = new RegExp(orderNumber, 'i');
    }

    if (customerName) {
      query.customerName = new RegExp(customerName, 'i');
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('userId', 'username email');

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取订单列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取订单列表失败',
      error: error.message
    });
  }
};

/**
 * 获取单个订单详情
 */
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('获取订单详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取订单详情失败',
      error: error.message
    });
  }
};

/**
 * 更新订单状态
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, adminNote } = req.body;

    const updateData = { status };

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    if (adminNote) {
      updateData.adminNote = adminNote;
    }

    // 根据状态更新相应的时间戳
    if (status === 'shipped') {
      updateData.shippedAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    } else if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    res.json({
      success: true,
      data: order,
      message: '订单状态更新成功'
    });
  } catch (error) {
    console.error('更新订单状态失败:', error);
    res.status(500).json({
      success: false,
      message: '更新订单状态失败',
      error: error.message
    });
  }
};

/**
 * 获取订单统计
 */
exports.getOrderStats = async (req, res) => {
  try {
    const total = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: 'pending' });
    const processing = await Order.countDocuments({ status: 'processing' });
    const shipped = await Order.countDocuments({ status: 'shipped' });
    const delivered = await Order.countDocuments({ status: 'delivered' });
    const cancelled = await Order.countDocuments({ status: 'cancelled' });

    // 计算总销售额
    const salesResult = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      { $group: { _id: null, totalSales: { $sum: '$total' } } }
    ]);
    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;

    res.json({
      success: true,
      data: {
        total,
        pending,
        processing,
        shipped,
        delivered,
        cancelled,
        totalSales
      }
    });
  } catch (error) {
    console.error('获取订单统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取订单统计失败',
      error: error.message
    });
  }
};

/**
 * 获取用户订单（前台）
 */
exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = {};
    if (req.user) {
      query.userId = req.user._id;
    } else {
      // 如果没有登录，通过手机号查询
      const { customerPhone } = req.query;
      if (customerPhone) {
        query.customerPhone = customerPhone;
      } else {
        return res.status(400).json({
          success: false,
          message: '请提供查询条件'
        });
      }
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取用户订单失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户订单失败',
      error: error.message
    });
  }
};
