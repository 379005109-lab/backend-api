import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '分类名称不能为空'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'slug不能为空'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    order: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    productCount: {
      type: Number,
      default: 0,
    },
    hasDiscount: {
      type: Boolean,
      default: false,
    },
    discounts: [
      {
        role: {
          type: String,
          enum: ['designer', 'distributor', 'customer'],
        },
        roleName: String,
        discount: {
          type: Number,
          default: 100,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

// 索引
categorySchema.index({ slug: 1 })
categorySchema.index({ parentId: 1 })
categorySchema.index({ status: 1 })
categorySchema.index({ order: 1 })

const Category = mongoose.model('Category', categorySchema)

export default Category
