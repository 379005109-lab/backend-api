import Image from '../models/Image.js'

// 上传图片（单张）
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的图片',
      })
    }

    // 将图片buffer转换为Base64
    const base64Data = req.file.buffer.toString('base64')

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomNum = Math.round(Math.random() * 1e9)
    const filename = `${timestamp}-${randomNum}-${req.file.originalname}`

    // 创建图片记录
    const imageData = {
      filename: filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      data: base64Data,
      type: req.body.type || 'other',
      description: req.body.description,
      tags: req.body.tags ? req.body.tags.split(',') : [],
    }

    // 如果有关联资源
    if (req.body.relatedId) {
      imageData.relatedId = req.body.relatedId
      imageData.relatedModel = req.body.relatedModel
    }

    // 如果用户已登录，记录上传者
    if (req.user) {
      imageData.uploadBy = req.user._id
    }

    const image = await Image.create(imageData)

    res.status(201).json({
      success: true,
      data: {
        _id: image._id,
        filename: image.filename,
        originalname: image.originalname,
        mimetype: image.mimetype,
        size: image.size,
        type: image.type,
        dataUrl: image.dataUrl, // 包含 data URL
        createdAt: image.createdAt,
      },
      message: '图片上传成功',
    })
  } catch (error) {
    next(error)
  }
}

// 批量上传图片
export const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的图片',
      })
    }

    const uploadedImages = []

    for (const file of req.files) {
      const base64Data = file.buffer.toString('base64')
      const timestamp = Date.now()
      const randomNum = Math.round(Math.random() * 1e9)
      const filename = `${timestamp}-${randomNum}-${file.originalname}`

      const imageData = {
        filename: filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        data: base64Data,
        type: req.body.type || 'other',
      }

      if (req.user) {
        imageData.uploadBy = req.user._id
      }

      const image = await Image.create(imageData)
      uploadedImages.push({
        _id: image._id,
        filename: image.filename,
        originalname: image.originalname,
        dataUrl: image.dataUrl,
      })
    }

    res.status(201).json({
      success: true,
      data: uploadedImages,
      message: `成功上传 ${uploadedImages.length} 张图片`,
    })
  } catch (error) {
    next(error)
  }
}

// 获取图片列表
export const getAllImages = async (req, res, next) => {
  try {
    const { type, relatedId, page = 1, limit = 20 } = req.query

    const filter = {}
    if (type) filter.type = type
    if (relatedId) filter.relatedId = relatedId

    const skip = (parseInt(page) - 1) * parseInt(limit)

    // 不返回data字段（太大），只返回元数据
    const images = await Image.find(filter)
      .select('-data') // 排除data字段
      .populate('uploadBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    const total = await Image.countDocuments(filter)

    res.json({
      success: true,
      data: images,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      message: '获取图片列表成功',
    })
  } catch (error) {
    next(error)
  }
}

// 获取单张图片（包含完整数据）
export const getImageById = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id)
      .populate('uploadBy', 'username')

    if (!image) {
      return res.status(404).json({
        success: false,
        message: '图片不存在',
      })
    }

    res.json({
      success: true,
      data: {
        _id: image._id,
        filename: image.filename,
        originalname: image.originalname,
        mimetype: image.mimetype,
        size: image.size,
        type: image.type,
        dataUrl: image.dataUrl, // 返回完整的data URL
        description: image.description,
        tags: image.tags,
        uploadBy: image.uploadBy,
        createdAt: image.createdAt,
      },
      message: '获取图片成功',
    })
  } catch (error) {
    next(error)
  }
}

// 删除图片
export const deleteImage = async (req, res, next) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id)

    if (!image) {
      return res.status(404).json({
        success: false,
        message: '图片不存在',
      })
    }

    res.json({
      success: true,
      message: '删除图片成功',
    })
  } catch (error) {
    next(error)
  }
}

// 批量删除图片
export const batchDeleteImages = async (req, res, next) => {
  try {
    const { ids } = req.body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供要删除的图片ID列表',
      })
    }

    const result = await Image.deleteMany({ _id: { $in: ids } })

    res.json({
      success: true,
      data: { deletedCount: result.deletedCount },
      message: `成功删除 ${result.deletedCount} 张图片`,
    })
  } catch (error) {
    next(error)
  }
}

// 更新图片信息
export const updateImage = async (req, res, next) => {
  try {
    const { description, tags, type } = req.body

    const updateData = {}
    if (description !== undefined) updateData.description = description
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : tags.split(',')
    if (type !== undefined) updateData.type = type

    const image = await Image.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-data')

    if (!image) {
      return res.status(404).json({
        success: false,
        message: '图片不存在',
      })
    }

    res.json({
      success: true,
      data: image,
      message: '更新图片信息成功',
    })
  } catch (error) {
    next(error)
  }
}
