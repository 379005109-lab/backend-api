const express = require('express');
const router = express.Router();
const {
  register,
  login,
  sendVerificationCode,
  getCurrentUser,
  getAllUsers
} = require('../controllers/authController');

// 公开路由
router.post('/register', register);
router.post('/login', login);
router.post('/send-code', sendVerificationCode);

// 需要认证的路由
router.get('/me', getCurrentUser);
router.get('/users', getAllUsers);

module.exports = router;
