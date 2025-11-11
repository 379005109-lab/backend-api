import mongoose from 'mongoose'

const skuSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  images: [String],
})

const productSchema = new mongoose.Schema(
  {
    // 兼容两种命名方式
    name: {
      type: String,
      trim: true,
      maxlength: [200, '商品名称最多200个字符'],
    },
    productName: {
      type: String,
      trim: true,
      maxlength: [200, '商品名称最多200个字符'],
    },
    model: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: ['sofa', 'bed', 'dining', 'storage', 'desk', 'chair', 'decoration', '沙发', '床', '餐桌', '储物', '书桌', '椅子', '装饰', '沙'],
    },
    style: {
      type: String,
      enum: ['vintage', 'modern', 'cream', 'minimalist', 'industrial', 'scandinavian'],
    },
    basePrice: {
      type: Number,
      min: 0,
    },
    listPrice: {
      type: Number,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    isPro: {
      type: Boolean,
      default: false,
    },
    proFeatures: {
      type: String,
    },
    dimensions: {
      type: String,
    },
    material: {
      type: mongoose.Schema.Types.Mixed,  // 支持字符串或对象格式
    },
    filling: {
      type: mongoose.Schema.Types.Mixed,  // 支持字符串或对象格式
    },
    frame: {
      type: mongoose.Schema.Types.Mixed,  // 支持字符串或对象格式
    },
    legs: {
      type: mongoose.Schema.Types.Mixed,  // 支持字符串或对象格式
    },
    images: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },
    files: {
      type: [{
        name: String,
        url: String,
        format: String,
        size: Number,
        uploadTime: String,
      }],
      default: [],
    },
    skus: {
      type: [skuSchema],
      default: [],
    },
    isCombo: {
      type: Boolean,
      default: false,
    },
    comboItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    tags: [String],
    specifications: {
      type: mongoose.Schema.Types.Mixed,  // 支持字符串或Map
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    sales: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// 索引
productSchema.index({ name: 'text', description: 'text' })
productSchema.index({ category: 1, style: 1 })
productSchema.index({ status: 1 })
productSchema.index({ createdAt: -1 })

const Product = mongoose.model('Product', productSchema)

export default Product

