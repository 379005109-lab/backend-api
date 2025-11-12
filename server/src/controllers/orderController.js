import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendOrderNotificationEmail } from "../services/emailService.js";
import User from "../models/User.js";

// @desc    获取订单列表（管理员）
// @route   GET /api/orders
// @access  Private (Admin)
export const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;

    // 构建查询条件
    const query = {};

    if (status) query.status = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // 分页查询
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orders = await Order.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate("user", "username email phone")
      .populate("items.product", "name images")
      .lean();

    // 过滤掉已删除商品的订单项，确保数据安全
    const safeOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        productName: item.productName || item.product?.name || "商品已下架",
        productImage: item.productImage || item.product?.images?.[0] || "",
        sku: item.sku || { color: "", material: "" },
      })),
    }));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: safeOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    获取我的订单列表
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const { status } = req.query;

    // 构建查询条件 - 只查询当前用户的订单
    const query = { user: req.user._id };

    if (status) query.status = status;

    // 查询订单
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "username email phone")
      .populate("items.product", "name images")
      .lean();

    // 过滤掉已删除商品的订单项，确保数据安全
    const safeOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        productName: item.productName || item.product?.name || "商品已下架",
        productImage: item.productImage || item.product?.images?.[0] || "",
        sku: item.sku || { color: "", material: "" },
      })),
      shippingAddress: order.shippingAddress || { name: "未填写", phone: "" },
    }));

    res.json({
      success: true,
      data: safeOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    获取单个订单
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email phone")
      .populate("items.product", "name images")
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "订单不存在",
      });
    }

    // 过滤掉已删除商品的订单项，确保数据安全
    const safeOrder = {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        productName: item.productName || item.product?.name || "商品已下架",
        productImage: item.productImage || item.product?.images?.[0] || "",
        sku: item.sku || { color: "", material: "" },
      })),
    };

    // 普通用户只能查看自己的订单
    if (
      !["admin", "super_admin"].includes(req.user.role) &&
      safeOrder.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "权限不足",
      });
    }

    res.json({
      success: true,
      data: safeOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    创建订单
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress: rawShippingAddress,
      paymentMethod: rawPaymentMethod,
      notes: rawNotes,
      customerName,
      customerPhone,
      customerEmail,
      customerNote,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "订单商品列表不能为空",
      });
    }

    // 兼容旧版字段的收货信息
    const normalizedShippingAddress = {
      ...rawShippingAddress,
    };

    const fallbackName =
      normalizedShippingAddress?.name || customerName || req.body.name;
    const fallbackPhone =
      normalizedShippingAddress?.phone || customerPhone || req.body.phone;
    normalizedShippingAddress.name = fallbackName || "";
    normalizedShippingAddress.phone = fallbackPhone || "";

    // address 优先使用新字段，其次兼容 legacy 字段
    normalizedShippingAddress.address =
      normalizedShippingAddress.address ||
      req.body.address ||
      req.body.shippingAddressLine ||
      normalizedShippingAddress.detail ||
      "";

    normalizedShippingAddress.province =
      normalizedShippingAddress.province ||
      req.body.province ||
      req.body.shippingProvince ||
      "";
    normalizedShippingAddress.city =
      normalizedShippingAddress.city ||
      req.body.city ||
      req.body.shippingCity ||
      "";
    normalizedShippingAddress.district =
      normalizedShippingAddress.district ||
      req.body.district ||
      req.body.shippingDistrict ||
      "";
    normalizedShippingAddress.zipCode =
      normalizedShippingAddress.zipCode ||
      req.body.zipCode ||
      req.body.postcode ||
      "";
    normalizedShippingAddress.detail =
      normalizedShippingAddress.detail ||
      req.body.detail ||
      req.body.street ||
      "";

    if (!normalizedShippingAddress.name || !normalizedShippingAddress.phone) {
      return res.status(400).json({
        success: false,
        message: "收货信息不完整，请填写收货人姓名和联系电话",
      });
    }

    const hasAddress = Boolean(
      (normalizedShippingAddress.address &&
        normalizedShippingAddress.address.trim()) ||
        (normalizedShippingAddress.province &&
          normalizedShippingAddress.city &&
          (normalizedShippingAddress.detail ||
            normalizedShippingAddress.district)),
    );

    if (!hasAddress) {
      return res.status(400).json({
        success: false,
        message: "收货地址不能为空",
      });
    }

    const allowedPaymentMethods = ["alipay", "wechat", "card", "cod"];
    const normalizedPaymentMethod = (() => {
      const candidate = (rawPaymentMethod || req.body.payMethod || "cod")
        .toString()
        .toLowerCase();
      return allowedPaymentMethods.includes(candidate) ? candidate : "cod";
    })();

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const productId = item.product || item.productId;
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "商品ID缺失",
        });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `商品不存在: ${productId}`,
        });
      }

      const skuId = item.skuId || item.sku?._id || item.skuIdStr;
      const skuMatchByColor = (candidateSku) => {
        if (!item.sku) return false;
        const { color, material } = item.sku;
        const colorMatch = color ? candidateSku.color === color : true;
        const materialMatch = material
          ? candidateSku.material === material
          : true;
        return colorMatch && materialMatch;
      };

      let resolvedSku = null;
      if (skuId && product.skus?.length) {
        const skuIdStr = skuId.toString();
        resolvedSku = product.skus.find((s) => s._id.toString() === skuIdStr);
      }

      if (!resolvedSku && product.skus?.length) {
        resolvedSku =
          product.skus.find((s) => skuMatchByColor(s)) || product.skus[0];
      }

      if (!product.skus?.length) {
        resolvedSku = null;
      }

      if (!resolvedSku && product.skus?.length) {
        return res.status(404).json({
          success: false,
          message: `SKU不存在，商品：${product.name}`,
        });
      }

      const quantity = Number(item.quantity) || 0;
      if (quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `商品 ${product.name} 数量无效`,
        });
      }

      const priceFromRequest = Number(item.price);
      const fallbackPrice =
        resolvedSku?.price ??
        product.discountPrice ??
        product.listPrice ??
        product.basePrice;
      const itemPrice = priceFromRequest > 0 ? priceFromRequest : fallbackPrice;

      if (!itemPrice || itemPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: `商品 ${product.name} 价格无效`,
        });
      }

      if (resolvedSku) {
        if (resolvedSku.stock < quantity) {
          return res.status(400).json({
            success: false,
            message: `商品 ${product.name} 库存不足`,
          });
        }
      } else if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `商品 ${product.name} 库存不足`,
        });
      }

      const itemTotal = itemPrice * quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        productName: item.productName || product.name || product.productName,
        productImage:
          item.productImage ||
          (product.images && product.images.length > 0
            ? product.images[0]
            : ""),
        sku: {
          color: resolvedSku?.color || item.sku?.color || "",
          material: resolvedSku?.material || item.sku?.material || "",
        },
        quantity,
        price: itemPrice,
      });

      if (resolvedSku) {
        resolvedSku.stock -= quantity;
        product.sales += quantity;
        product.markModified("skus");
      } else {
        product.stock = Math.max(0, (product.stock || 0) - quantity);
        product.sales += quantity;
      }

      await product.save();
    }

    const notes = rawNotes ?? customerNote ?? "";

    const orderPayload = {
      items: orderItems,
      totalAmount,
      shippingAddress: normalizedShippingAddress,
      paymentMethod: normalizedPaymentMethod,
      notes,
      customerName: normalizedShippingAddress.name,
      customerPhone: normalizedShippingAddress.phone,
      customerEmail: customerEmail || req.body.email || "",
    };

    if (req.user?._id) {
      orderPayload.user = req.user._id;
    }

    const order = await Order.create(orderPayload);

    if (order.user) {
      await order.populate("user", "username email phone");
    }

    sendOrderNotificationEmail({
      ...order.toObject(),
      user: order.user,
    }).catch((error) => {
      console.error("发送订单通知邮件失败（不影响订单创建）:", error);
    });

    res.status(201).json({
      success: true,
      message: "订单创建成功",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    更新订单状态
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "订单不存在",
      });
    }

    order.status = status;

    if (status === "paid" && !order.paidAt) {
      order.paidAt = new Date();
    }

    if (status === "shipped") {
      order.shippedAt = new Date();
      if (trackingNumber) {
        order.trackingNumber = trackingNumber;
      }
    }

    if (status === "completed" && !order.completedAt) {
      order.completedAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: "订单状态已更新",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    更新物流单号
// @route   PUT /api/orders/:id/tracking
// @access  Private (Admin)
export const updateOrderTracking = async (req, res, next) => {
  try {
    const { trackingNumber } = req.body;

    if (!trackingNumber || !trackingNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: "物流单号不能为空",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "订单不存在",
      });
    }

    order.trackingNumber = trackingNumber.trim();

    // 如果订单状态是已付款，自动更新为已发货
    if (order.status === "paid") {
      order.status = "shipped";
      order.shippedAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: "物流单号已更新",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    删除订单
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "订单不存在",
      });
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: "订单已删除",
    });
  } catch (error) {
    next(error);
  }
};
