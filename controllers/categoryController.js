const Category = require('../models/Category');

// @desc    获取所有分类
// @route   GET /api/categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort('order level name');
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    获取分类树
// @route   GET /api/categories/tree
exports.getCategoryTree = async (req, res) => {
  try {
    // 获取所有活跃分类
    const categories = await Category.find({ isActive: true })
      .sort('order level name');
    
    // 构建树形结构
    const buildTree = (parentId = null) => {
      return categories
        .filter(cat => {
          if (parentId === null) {
            return cat.parentId === null || cat.parentId === undefined;
          }
          return cat.parentId && cat.parentId.toString() === parentId.toString();
        })
        .map(cat => ({
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          level: cat.level,
          order: cat.order,
          children: buildTree(cat._id)
        }));
    };
    
    const tree = buildTree();
    
    res.status(200).json({
      success: true,
      data: tree
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    获取单个分类
// @route   GET /api/categories/:id
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: '分类不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    创建分类
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    更新分类
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: '分类不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    删除分类
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: '分类不存在'
      });
    }
    
    // 检查是否有子分类
    const children = await Category.find({ parentId: req.params.id });
    if (children.length > 0) {
      return res.status(400).json({
        success: false,
        error: '该分类下有子分类，无法删除'
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
