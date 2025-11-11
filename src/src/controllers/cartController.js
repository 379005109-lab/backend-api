import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

// 获取购物车
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product')

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] })
    }

    res.json({
      success: true,
      data: cart,
      message: '获取购物车成功',
    })
  } catch (error) {
    next(error)
  }
}

// 添加商品到购物车
export const addToCart = async (req, res, next) => {
  try {
    const { productId, skuId, quantity = 1, price, selectedMaterials } = req.body

    // 验证商品存在
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在',
      })
    }

    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] })
    }

    // 检查商品是否已在购物车中
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        (!skuId || item.sku?.toString() === skuId)
    )

    if (existingItemIndex > -1) {
      // 更新数量
      cart.items[existingItemIndex].quantity += quantity
    } else {
      // 添加新商品
      cart.items.push({
        product: productId,
        sku: skuId,
        quantity,
        price: price || product.basePrice,
        selectedMaterials,
      })
    }

    await cart.save()
    await cart.populate('items.product')

    res.json({
      success: true,
      data: cart,
      message: '添加到购物车成功',
    })
  } catch (error) {
    next(error)
  }
}

// 更新购物车商品数量
export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params
    const { quantity } = req.body

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: '数量必须大于0',
      })
    }

    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '购物车不存在',
      })
    }

    const item = cart.items.id(itemId)
    if (!item) {
      return res.status(404).json({
        success: false,
        message: '购物车商品不存在',
      })
    }

    item.quantity = quantity
    await cart.save()
    await cart.populate('items.product')

    res.json({
      success: true,
      data: cart,
      message: '更新成功',
    })
  } catch (error) {
    next(error)
  }
}

// 删除购物车商品
export const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params

    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '购物车不存在',
      })
    }

    cart.items.pull(itemId)
    await cart.save()
    await cart.populate('items.product')

    res.json({
      success: true,
      data: cart,
      message: '删除成功',
    })
  } catch (error) {
    next(error)
  }
}

// 清空购物车
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '购物车不存在',
      })
    }

    cart.items = []
    await cart.save()

    res.json({
      success: true,
      data: cart,
      message: '清空购物车成功',
    })
  } catch (error) {
    next(error)
  }
}
