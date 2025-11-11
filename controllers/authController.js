const AuthUser = require('../models/AuthUser');
const jwt = require('jsonwebtoken');

// JWT Secret (应该从环境变量读取)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = '7d';

// @desc    用户注册
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { username, password, phone, verificationCode } = req.body;

    // 验证必填字段
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: '请提供用户名和密码'
      });
    }

    // 如果提供了手机号，验证验证码（这里简化处理）
    if (phone && verificationCode) {
      // 实际应该验证验证码
      // 这里简化：接受任何6位数字作为验证码
      if (!/^\d{6}$/.test(verificationCode)) {
        return res.status(400).json({
          success: false,
          error: '验证码格式不正确'
        });
      }
    }

    // 检查用户名是否已存在
    const existingUser = await AuthUser.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: '用户名已存在'
      });
    }

    // 创建用户
    const user = await AuthUser.create({
      username,
      password,
      phone,
      role: 'user'
    });

    // 生成 JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          phone: user.phone
        }
      },
      message: '注册成功'
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      error: error.message || '注册失败'
    });
  }
};

// @desc    用户登录
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const loginField = username || email;

    // 验证必填字段
    if (!loginField || !password) {
      return res.status(400).json({
        success: false,
        error: '请提供用户名和密码'
      });
    }

    // 查找用户（支持用户名、邮箱、手机号）
    const user = await AuthUser.findOne({
      $or: [
        { username: loginField },
        { email: loginField },
        { phone: loginField }
      ]
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误'
      });
    }

    // 检查用户是否激活
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: '账号已被禁用'
      });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: '用户名或密码错误'
      });
    }

    // 更新最后登录时间
    user.lastLoginAt = Date.now();
    await user.save();

    // 生成 JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          phone: user.phone,
          lastLoginAt: user.lastLoginAt
        }
      },
      message: '登录成功'
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      error: error.message || '登录失败'
    });
  }
};

// @desc    发送验证码
// @route   POST /api/auth/send-code
exports.sendVerificationCode = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: '请提供手机号'
      });
    }

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        error: '手机号格式不正确'
      });
    }

    // 生成6位验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // TODO: 实际应该调用短信服务发送验证码
    // 这里只是模拟发送成功
    console.log(`=== 模拟发送验证码 ===`);
    console.log(`手机号: ${phone}`);
    console.log(`验证码: ${code}`);
    console.log(`有效期: 10分钟`);
    console.log(`===================`);

    // 在实际生产环境中，应该：
    // 1. 调用短信服务API（如阿里云、腾讯云）
    // 2. 将验证码保存到Redis，设置10分钟过期
    // 3. 实现频率限制（如同一手机号1分钟内只能发送一次）

    res.status(200).json({
      success: true,
      message: '验证码已发送',
      // 开发环境下返回验证码，生产环境不应返回
      ...(process.env.NODE_ENV === 'development' && { code })
    });
  } catch (error) {
    console.error('发送验证码错误:', error);
    res.status(500).json({
      success: false,
      error: error.message || '发送验证码失败'
    });
  }
};

// @desc    验证 token 并获取当前用户信息
// @route   GET /api/auth/me
exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: '未提供认证token'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await AuthUser.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token无效或已过期'
    });
  }
};

// @desc    获取所有用户（仅管理员）
// @route   GET /api/auth/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await AuthUser.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    认证中间件 - 验证JWT token
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: '未提供认证token'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await AuthUser.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token无效或已过期'
    });
  }
};

// @desc    授权中间件 - 检查用户角色
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: '请先登录'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: '权限不足'
      });
    }

    next();
  };
};
