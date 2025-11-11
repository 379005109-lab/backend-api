import mongoose from 'mongoose'

const refundSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: [true, '退款原因不能为空'],
    },
    description: {
      type: String,
    },
    images: [String],
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    processedAt: {
      type: Date,
    },
    rejectReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// 索引
refundSchema.index({ order: 1 })
refundSchema.index({ user: 1 })
refundSchema.index({ status: 1 })

const Refund = mongoose.model('Refund', refundSchema)

export default Refund
