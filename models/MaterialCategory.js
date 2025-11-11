const mongoose = require('mongoose');

const materialCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '分类名称不能为空'],
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaterialCategory',
      default: null,
    },
    icon: {
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
materialCategorySchema.index({ parentId: 1 });
materialCategorySchema.index({ order: 1 });

const MaterialCategory = mongoose.model('MaterialCategory', materialCategorySchema);

module.exports = MaterialCategory;
