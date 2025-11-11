import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// 认证中间件
export const authenticate = async (req, res, next) => {
  try {
    // 从请求头获取token
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未授权，请先登录',
      })
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // 查找用户
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在',
      })
    }

    if (user.status === 'banned') {
      return res.status(403).json({
        success: false,
        message: '账号已被封禁',
      })
    }

    // 将用户信息挂载到请求对象
    req.user = user
    next()
  } catch (error) {
    console.error('认证错误:', error)
    res.status(401).json({
      success: false,
      message: '认证失败',
    })
  }
}

// 权限检查中间件
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '未授权',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '权限不足',
      })
    }

    next()
  }
}

