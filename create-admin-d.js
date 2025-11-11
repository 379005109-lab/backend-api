import mongoose from 'mongoose'
import User from './server/src/models/User.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin'

async function createAdmin() {
  try {
    console.log('🔌 连接数据库...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ 数据库连接成功')

    // 检查用户是否已存在
    const existingUser = await User.findOne({ username: 'd' })
    if (existingUser) {
      console.log('⚠️  用户 "d" 已存在')
      console.log('现有信息:', {
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
        status: existingUser.status
      })
      
      // 更新现有用户为超级管理员
      existingUser.role = 'super_admin'
      existingUser.status = 'active'
      existingUser.password = 'asd123..'  // 会自动加密
      await existingUser.save()
      console.log('✅ 已更新为超级管理员')
    } else {
      // 创建新用户
      const newAdmin = await User.create({
        username: 'd',
        email: 'd@admin.com',
        password: 'asd123..',
        phone: '10000000001',
        role: 'super_admin',
        status: 'active'
      })

      console.log('✅ 超级管理员创建成功！')
      console.log({
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status
      })
    }

    // 验证所有超级管理员
    const allAdmins = await User.find({ role: 'super_admin' })
    console.log('\n📋 当前所有超级管理员:')
    allAdmins.forEach(admin => {
      console.log(`  - ${admin.username} (${admin.email})`)
    })

    await mongoose.connection.close()
    console.log('\n✅ 完成')
  } catch (error) {
    console.error('❌ 错误:', error.message)
    process.exit(1)
  }
}

createAdmin()
