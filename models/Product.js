const mongoose = require('mongoose');

const skuSchema = new mongoose.Schema({
  color: String,
  material: mongoose.Schema.Types.Mixed,  // 支持字符串或对象 { fabric: [], filling: [], frame: [], leg: [] }
  materialUpgradePrices: mongoose.Schema.Types.Mixed,  // 材质升级价格 { [materialName]: price }
  stock: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  images: [String],
  code: String,
  spec: String,
  length: Number,
  width: Number,
  height: Number,
  discountPrice: { type: Number, default: 0 },
  isPro: { type: Boolean, default: false },
  proFeature: String,
});

const Product = mongoose.model('Product', new mongoose.Schema({
  productName: String,
  model: String,
  category: String,
  listPrice: Number,
  stock: { type: Number, default: 0 },
  discountPrice: { type: Number, default: 0 },
  isPro: { type: Boolean, default: false },
  proFeatures: String,
  images: [String],
  tags: [String],
  specifications: mongoose.Schema.Types.Mixed,
  dimensions: String,
  material: String,
  filling: String,
  frame: String,
  legs: String,
  name: String,
  description: String,
  style: String,
  basePrice: Number,
  status: { type: String, default: 'active' },
  views: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  skus: [skuSchema],  // SKU数组
  videos: [String],  // 视频列表
  files: [{ name: String, url: String, format: String, size: Number, uploadTime: String }],  // 文件列表
}, { timestamps: true }));

module.exports = Product;
