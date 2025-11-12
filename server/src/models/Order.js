import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: String,
  productImage: String,
  sku: {
    color: String,
    material: mongoose.Schema.Types.Mixed, // 支持字符串或对象格式，兼容旧数据
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNo: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    customerName: {
      type: String,
    },
    customerPhone: {
      type: String,
    },
    customerEmail: {
      type: String,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "订单至少包含一件商品",
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "shipped",
        "completed",
        "cancelled",
        "refunding",
        "refunded",
      ],
      default: "pending",
    },
    shippingAddress: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      // 新格式：直接填写地址
      address: {
        type: String,
        required: false, // 为了向后兼容，设为可选
      },
      // 旧格式：保留以支持向后兼容
      province: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      district: {
        type: String,
        required: false,
      },
      detail: {
        type: String,
        required: false,
      },
    },
    paymentMethod: {
      type: String,
      enum: ["alipay", "wechat", "card", "cod"],
      default: "cod",
      required: true,
    },
    paidAt: Date,
    shippedAt: Date,
    completedAt: Date,
    notes: String,
    trackingNumber: String,
  },
  {
    timestamps: true,
  },
);

// 生成订单号
orderSchema.pre("save", async function (next) {
  if (!this.orderNo) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.orderNo = `ORD${dateStr}${random}`;
  }
  next();
});

// 索引
orderSchema.index({ orderNo: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
