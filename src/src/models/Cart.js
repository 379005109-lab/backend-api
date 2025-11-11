import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        sku: {
          type: mongoose.Schema.Types.ObjectId,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        selectedMaterials: {
          fabric: String,
          filling: String,
          frame: String,
          leg: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

// 索引
cartSchema.index({ user: 1 })

const Cart = mongoose.model('Cart', cartSchema)

export default Cart
