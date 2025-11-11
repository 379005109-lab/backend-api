import express from 'express'
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

// 所有路由都需要认证
router.use(authenticate)

// @route   GET /api/users
// @desc    获取用户列表
// @access  Private (Admin)
router.get('/', authorize('admin', 'super_admin'), getUsers)

// @route   GET /api/users/:id
// @desc    获取单个用户
// @access  Private
router.get('/:id', getUser)

// @route   PUT /api/users/:id
// @desc    更新用户
// @access  Private
router.put('/:id', updateUser)

// @route   DELETE /api/users/:id
// @desc    删除用户
// @access  Private (Admin)
router.delete('/:id', authorize('admin', 'super_admin'), deleteUser)

export default router

