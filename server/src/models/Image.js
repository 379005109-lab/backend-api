import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    // Base64编码的图片数据
    data: {
      type: String,
      required: true,
    },
    // 图片类型分类
    type: {
      type: String,
      enum: ['banner', 'product', 'material', 'avatar', 'other'],
      default: 'other',
    },
    // 关联的资源ID（如商品ID、用户ID等）
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    relatedModel: {
      type: String,
      enum: ['Product', 'User', 'Material', 'Category', null],
    },
    // 上传者
    uploadBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // 描述
    description: {
      type: String,
    },
    // 标签
    tags: [String],
  },
  {
    timestamps: true,
  }
)

// 索引
imageSchema.index({ type: 1 })
imageSchema.index({ relatedId: 1 })
imageSchema.index({ uploadBy: 1 })
imageSchema.index({ createdAt: -1 })

// 虚拟字段：返回完整的data URL
imageSchema.virtual('dataUrl').get(function () {
  return `data:${this.mimetype};base64,${this.data}`
})

// 转换为JSON时包含虚拟字段
imageSchema.set('toJSON', { virtuals: true })
imageSchema.set('toObject', { virtuals: true })

const Image = mongoose.model('Image', imageSchema)

export default Image
