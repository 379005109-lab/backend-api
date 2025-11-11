import express from 'express'
import { body } from 'express-validator'
import { register, login, getMe } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// @route   POST /api/auth/register
// @desc    注册用户
// @access  Public
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 2 }).withMessage('用户名至少2个字符'),
    body('email').isEmail().withMessage('请输入有效的邮箱'),
    body('password').isLength({ min: 6 }).withMessage('密码至少6个字符'),
  ],
  register
)

// @route   POST /api/auth/login
// @desc    登录
// @access  Public
router.post(
  '/login',
  [
    body('email').notEmpty().withMessage('请提供用户名和密码'),
    body('password').notEmpty().withMessage('请提供用户名和密码'),
  ],
  login
)

// @route   GET /api/auth/me
// @desc    获取当前用户信息
// @access  Private
router.get('/me', authenticate, getMe)

export default router

