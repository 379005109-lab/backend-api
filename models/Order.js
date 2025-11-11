const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: String,
  model: String,
  image: String,
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  subtotal: {
    type: Number,
    required: true
  },
  // SKU相关信息
  sku: {
    color: String,
    material: String,
    spec: String
  }
});

const orderSchema = new mongoose.Schema({
  // 订单号
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  // 用户信息
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerEmail: String,
  
  // 收货地址
  shippingAddress: {
    province: String,
    city: String,
    district: String,
    address: String,
    zipCode: String
  },
  
  // 订单商品
  items: [orderItemSchema],
  
  // 价格信息
  subtotal: {
    type: Number,
    required: true
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  
  // 订单状态
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // 支付信息
  paymentMethod: {
    type: String,
    enum: ['wechat', 'alipay', 'card', 'cod'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  paidAt: Date,
  
  // 物流信息
  trackingNumber: String,
  shippedAt: Date,
  deliveredAt: Date,
  
  // 备注
  customerNote: String,
  adminNote: String,
  
  // 取消信息
  cancelledAt: Date,
  cancelReason: String
}, {
  timestamps: true
});

// 生成订单号
orderSchema.statics.generateOrderNumber = function() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD${year}${month}${day}${random}`;
};

// 索引
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
