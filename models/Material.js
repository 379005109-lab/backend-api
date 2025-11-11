const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '素材名称不能为空'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['image', 'texture', 'model'],
      required: true,
    },
    image: {
      type: String,
      required: [true, '素材图片不能为空'],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaterialCategory',
    },
    categoryName: {
      type: String,
    },
    tags: [String],
    properties: {
      type: Map,
      of: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'offline'],
      default: 'pending',
    },
    uploadBy: {
      type: String,
    },
    reviewBy: {
      type: String,
    },
    reviewAt: {
      type: Date,
    },
    reviewNote: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 索引
materialSchema.index({ categoryId: 1 });
materialSchema.index({ status: 1 });
materialSchema.index({ type: 1 });
materialSchema.index({ order: 1 });

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;
