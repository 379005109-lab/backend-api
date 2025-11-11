import { validationResult } from 'express-validator'
import User from '../models/User.js'

// @desc    用户注册
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    // 验证输入
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    const { username, email, password, phone } = req.body

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已存在',
      })
    }

    // 创建用户
    const user = await User.create({
      username,
      email,
      password,
      phone,
    })

    // 生成token
    const token = user.generateToken()

    // 返回用户信息（不包含密码）
    const userResponse = user.toObject()
    delete userResponse.password

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: userResponse,
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    用户登录
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    // 验证输入
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    const { email, password } = req.body

    // 查找用户（支持用户名、邮箱或手机号登录）
    const user = await User.findOne({
      $or: [
        { email },
        { username: email },
        { phone: email }
      ]
    }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '账号或密码错误',
      })
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误',
      })
    }

    // 检查账号状态
    if (user.status === 'banned') {
      return res.status(403).json({
        success: false,
        message: '账号已被封禁',
      })
    }

    // 更新最后登录时间和IP
    user.lastLoginAt = new Date()
    user.lastLoginIp = req.ip
    await user.save()

    // 生成token
    const token = user.generateToken()

    // 返回用户信息（不包含密码）
    const userResponse = user.toObject()
    delete userResponse.password

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: userResponse,
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    获取当前用户信息
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

