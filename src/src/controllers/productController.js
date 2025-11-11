import Product from '../models/Product.js'

// @desc    获取商品列表
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      style,
      status,
      minPrice,
      maxPrice,
      search,
      sort = 'createdAt',
      order = 'desc',
    } = req.query

    // 构建查询条件
    const query = {}
    
    if (category) query.category = category
    if (style) query.style = style
    if (status) query.status = status
    
    if (minPrice || maxPrice) {
      query.basePrice = {}
      if (minPrice) query.basePrice.$gte = parseFloat(minPrice)
      if (maxPrice) query.basePrice.$lte = parseFloat(maxPrice)
    }

    if (search) {
      query.$text = { $search: search }
    }

    // 排序
    const sortObj = {}
    sortObj[sort] = order === 'desc' ? -1 : 1

    // 分页查询
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortObj)
      .populate('comboItems', 'name images basePrice')

    const total = await Product.countDocuments(query)

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    获取单个商品
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'comboItems',
      'name images basePrice'
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在',
      })
    }

    // 增加浏览量
    product.views += 1
    await product.save()

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    创建商品
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body)

    res.status(201).json({
      success: true,
      message: '商品创建成功',
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    更新商品
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在',
      })
    }

    res.json({
      success: true,
      message: '商品更新成功',
      data: product,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    删除商品
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: '商品不存在',
      })
    }

    await product.deleteOne()

    res.json({
      success: true,
      message: '商品已删除',
    })
  } catch (error) {
    next(error)
  }
}

