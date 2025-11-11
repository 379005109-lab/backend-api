import User from '../models/User.js'

// @desc    获取用户列表
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      status,
      search,
    } = req.query

    // 构建查询条件
    const query = {}
    if (role) query.role = role
    if (status) query.status = status
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    // 分页查询
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const users = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(query)

    res.json({
      success: true,
      data: users,
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

// @desc    获取单个用户
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      })
    }

    // 普通用户只能查看自己的信息
    if (
      req.user._id.toString() !== user._id.toString() &&
      !['admin', 'super_admin'].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: '权限不足',
      })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    更新用户
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      })
    }

    // 普通用户只能更新自己的信息
    if (
      req.user._id.toString() !== user._id.toString() &&
      !['admin', 'super_admin'].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: '权限不足',
      })
    }

    // 普通用户不能修改角色和状态
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      delete req.body.role
      delete req.body.status
    }

    // 不允许直接修改密码（需要通过专门的接口）
    delete req.body.password

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      message: '用户信息已更新',
      data: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    删除用户
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      })
    }

    // 不能删除超级管理员
    if (user.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: '不能删除超级管理员',
      })
    }

    await user.deleteOne()

    res.json({
      success: true,
      message: '用户已删除',
    })
  } catch (error) {
    next(error)
  }
}

