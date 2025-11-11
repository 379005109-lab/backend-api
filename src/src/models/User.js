import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, '请输入用户名'],
      unique: true,
      trim: true,
      minlength: [2, '用户名至少2个字符'],
      maxlength: [50, '用户名最多50个字符'],
    },
    email: {
      type: String,
      required: [true, '请输入邮箱'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, '请输入有效的邮箱地址'],
    },
    password: {
      type: String,
      required: [true, '请输入密码'],
      minlength: [6, '密码至少6个字符'],
      select: false, // 默认不返回密码
    },
    phone: {
      type: String,
      match: [/^1[3-9]\d{9}$/, '请输入有效的手机号'],
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'designer', 'distributor', 'customer'],
      default: 'customer',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'banned'],
      default: 'active',
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastLoginAt: Date,
    lastLoginIp: String,
  },
  {
    timestamps: true,
  }
)

// 密码加密中间件
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
})

// 验证密码方法
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// 生成JWT Token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })
}

const User = mongoose.model('User', userSchema)

export default User

