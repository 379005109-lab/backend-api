import Category from '../models/Category.js'

// 获取所有分类
export const getAllCategories = async (req, res, next) => {
  try {
    const { status, level, parentId } = req.query

    const filter = {}
    if (status) filter.status = status
    if (level) filter.level = parseInt(level)
    if (parentId) filter.parentId = parentId === 'null' ? null : parentId

    const categories = await Category.find(filter).sort({ order: 1, createdAt: 1 })

    res.json({
      success: true,
      data: categories,
      message: '获取分类列表成功',
    })
  } catch (error) {
    next(error)
  }
}

// 获取分类树形结构
export const getCategoryTree = async (req, res, next) => {
  try {
    const categories = await Category.find({ status: 'active' }).sort({ order: 1 })

    // 构建树形结构
    const tree = []
    const categoryMap = {}

    // 先创建映射
    categories.forEach((cat) => {
      categoryMap[cat._id] = {
        ...cat.toObject(),
        children: [],
      }
    })

    // 构建树
    categories.forEach((cat) => {
      if (!cat.parentId) {
        tree.push(categoryMap[cat._id])
      } else if (categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children.push(categoryMap[cat._id])
      }
    })

    res.json({
      success: true,
      data: tree,
      message: '获取分类树成功',
    })
  } catch (error) {
    next(error)
  }
}

// 获取单个分类
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在',
      })
    }

    res.json({
      success: true,
      data: category,
      message: '获取分类成功',
    })
  } catch (error) {
    next(error)
  }
}

// 创建分类
export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body)

    res.status(201).json({
      success: true,
      data: category,
      message: '创建分类成功',
    })
  } catch (error) {
    next(error)
  }
}

// 更新分类
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在',
      })
    }

    res.json({
      success: true,
      data: category,
      message: '更新分类成功',
    })
  } catch (error) {
    next(error)
  }
}

// 删除分类
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在',
      })
    }

    // 检查是否有子分类
    const childrenCount = await Category.countDocuments({
      parentId: req.params.id,
    })

    if (childrenCount > 0) {
      return res.status(400).json({
        success: false,
        message: '该分类下还有子分类，无法删除',
      })
    }

    await category.deleteOne()

    res.json({
      success: true,
      message: '删除分类成功',
    })
  } catch (error) {
    next(error)
  }
}

// 更新分类折扣
export const updateCategoryDiscount = async (req, res, next) => {
  try {
    const { hasDiscount, discounts } = req.body

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        hasDiscount,
        discounts,
      },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在',
      })
    }

    res.json({
      success: true,
      data: category,
      message: '更新折扣成功',
    })
  } catch (error) {
    next(error)
  }
}
