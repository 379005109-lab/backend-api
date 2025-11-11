import Favorite from '../models/Favorite.js'
import Product from '../models/Product.js'

// 获取收藏列表
export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: favorites,
      message: '获取收藏列表成功',
    })
  } catch (error) {
    next(error)
  }
}

// 添加收藏
export const addFavorite = async (req, res, next) => {
  try {
    const { productId } = req.body

    // 验证商品存在
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在',
      })
    }

    // 检查是否已收藏
    const existing = await Favorite.findOne({
      user: req.user._id,
      product: productId,
    })

    if (existing) {
      return res.status(400).json({
        success: false,
        message: '已经收藏过该商品',
      })
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      product: productId,
    })

    await favorite.populate('product')

    res.status(201).json({
      success: true,
      data: favorite,
      message: '收藏成功',
    })
  } catch (error) {
    next(error)
  }
}

// 取消收藏
export const removeFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params

    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      product: productId,
    })

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: '收藏不存在',
      })
    }

    res.json({
      success: true,
      message: '取消收藏成功',
    })
  } catch (error) {
    next(error)
  }
}

// 检查是否已收藏
export const checkFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params

    const favorite = await Favorite.findOne({
      user: req.user._id,
      product: productId,
    })

    res.json({
      success: true,
      data: { isFavorited: !!favorite },
      message: '查询成功',
    })
  } catch (error) {
    next(error)
  }
}
