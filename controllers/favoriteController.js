const Favorite = require('../models/Favorite');
const Product = require('../models/Product');

// @desc    获取所有收藏
// @route   GET /api/favorites
exports.getAllFavorites = async (req, res) => {
  try {
    // 如果有用户认证，可以从req.user获取userId
    // 这里暂时返回所有收藏
    const favorites = await Favorite.find()
      .populate('productId')
      .populate('userId', '-password')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    获取用户的收藏
// @route   GET /api/favorites/user/:userId
exports.getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId })
      .populate('productId')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    添加收藏
// @route   POST /api/favorites
exports.addFavorite = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        error: '请提供用户ID和产品ID'
      });
    }
    
    // 检查产品是否存在
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: '产品不存在'
      });
    }
    
    // 检查是否已收藏
    const existingFavorite = await Favorite.findOne({ userId, productId });
    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        error: '已经收藏过该产品'
      });
    }
    
    const favorite = await Favorite.create({ userId, productId });
    
    res.status(201).json({
      success: true,
      data: favorite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    删除收藏
// @route   DELETE /api/favorites/:id
exports.removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findByIdAndDelete(req.params.id);
    
    if (!favorite) {
      return res.status(404).json({
        success: false,
        error: '收藏不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    切换收藏状态
// @route   POST /api/favorites/toggle
exports.toggleFavorite = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        error: '请提供用户ID和产品ID'
      });
    }
    
    const existingFavorite = await Favorite.findOne({ userId, productId });
    
    if (existingFavorite) {
      // 如果已收藏，则取消收藏
      await Favorite.findByIdAndDelete(existingFavorite._id);
      return res.status(200).json({
        success: true,
        action: 'removed',
        data: { isFavorited: false }
      });
    } else {
      // 如果未收藏，则添加收藏
      const favorite = await Favorite.create({ userId, productId });
      return res.status(201).json({
        success: true,
        action: 'added',
        data: { isFavorited: true, favorite }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
