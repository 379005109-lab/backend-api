const Material = require('../models/Material');
const MaterialCategory = require('../models/MaterialCategory');

// ===== 素材管理 =====

// 获取素材列表
exports.getAllMaterials = async (req, res, next) => {
  try {
    const { categoryId, type, status, search } = req.query;

    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const materials = await Material.find(filter)
      .populate('categoryId')
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      data: materials,
      message: '获取素材列表成功',
    });
  } catch (error) {
    next(error);
  }
};

// 获取单个素材
exports.getMaterialById = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id).populate('categoryId');

    if (!material) {
      return res.status(404).json({
        success: false,
        message: '素材不存在',
      });
    }

    res.json({
      success: true,
      data: material,
      message: '获取素材成功',
    });
  } catch (error) {
    next(error);
  }
};

// 创建素材
exports.createMaterial = async (req, res, next) => {
  try {
    const materialData = {
      ...req.body,
      uploadBy: req.user ? req.user.username : 'anonymous',
    };

    const material = await Material.create(materialData);

    res.status(201).json({
      success: true,
      data: material,
      message: '创建素材成功',
    });
  } catch (error) {
    next(error);
  }
};

// 更新素材
exports.updateMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!material) {
      return res.status(404).json({
        success: false,
        message: '素材不存在',
      });
    }

    res.json({
      success: true,
      data: material,
      message: '更新素材成功',
    });
  } catch (error) {
    next(error);
  }
};

// 删除素材
exports.deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: '素材不存在',
      });
    }

    res.json({
      success: true,
      message: '删除素材成功',
    });
  } catch (error) {
    next(error);
  }
};

// 批量删除素材
exports.batchDeleteMaterials = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供要删除的素材ID列表',
      });
    }

    const result = await Material.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      data: { deletedCount: result.deletedCount },
      message: `成功删除 ${result.deletedCount} 个素材`,
    });
  } catch (error) {
    next(error);
  }
};

// 审核素材
exports.reviewMaterial = async (req, res, next) => {
  try {
    const { status, reviewNote } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '无效的审核状态',
      });
    }

    const material = await Material.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewBy: req.user ? req.user.username : 'admin',
        reviewAt: new Date(),
        reviewNote,
      },
      { new: true }
    );

    if (!material) {
      return res.status(404).json({
        success: false,
        message: '素材不存在',
      });
    }

    res.json({
      success: true,
      data: material,
      message: '审核完成',
    });
  } catch (error) {
    next(error);
  }
};

// 获取素材统计
exports.getMaterialStats = async (req, res, next) => {
  try {
    const stats = await Material.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      offline: 0,
    };

    stats.forEach((item) => {
      result[item._id] = item.count;
      result.total += item.count;
    });

    res.json({
      success: true,
      data: result,
      message: '获取统计成功',
    });
  } catch (error) {
    next(error);
  }
};

// ===== 素材分类管理 =====

// 获取素材分类列表
exports.getAllMaterialCategories = async (req, res, next) => {
  try {
    const categories = await MaterialCategory.find().sort({ order: 1, createdAt: 1 });

    res.json({
      success: true,
      data: categories,
      message: '获取分类列表成功',
    });
  } catch (error) {
    next(error);
  }
};

// 获取素材分类树
exports.getMaterialCategoryTree = async (req, res, next) => {
  try {
    const categories = await MaterialCategory.find().sort({ order: 1 });

    // 构建树形结构
    const tree = [];
    const categoryMap = {};

    categories.forEach((cat) => {
      categoryMap[cat._id] = {
        ...cat.toObject(),
        children: [],
      };
    });

    categories.forEach((cat) => {
      if (!cat.parentId) {
        tree.push(categoryMap[cat._id]);
      } else if (categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children.push(categoryMap[cat._id]);
      }
    });

    res.json({
      success: true,
      data: tree,
      message: '获取分类树成功',
    });
  } catch (error) {
    next(error);
  }
};

// 创建素材分类
exports.createMaterialCategory = async (req, res, next) => {
  try {
    const category = await MaterialCategory.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
      message: '创建分类成功',
    });
  } catch (error) {
    next(error);
  }
};

// 更新素材分类
exports.updateMaterialCategory = async (req, res, next) => {
  try {
    const category = await MaterialCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在',
      });
    }

    res.json({
      success: true,
      data: category,
      message: '更新分类成功',
    });
  } catch (error) {
    next(error);
  }
};

// 删除素材分类
exports.deleteMaterialCategory = async (req, res, next) => {
  try {
    const category = await MaterialCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在',
      });
    }

    // 检查是否有子分类
    const childrenCount = await MaterialCategory.countDocuments({
      parentId: req.params.id,
    });

    if (childrenCount > 0) {
      return res.status(400).json({
        success: false,
        message: '该分类下还有子分类，无法删除',
      });
    }

    // 检查是否有素材使用此分类
    const materialsCount = await Material.countDocuments({
      categoryId: req.params.id,
    });

    if (materialsCount > 0) {
      return res.status(400).json({
        success: false,
        message: '该分类下还有素材，无法删除',
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: '删除分类成功',
    });
  } catch (error) {
    next(error);
  }
};
