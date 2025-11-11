import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'

// 加载环境变量
dotenv.config()

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB已连接')

    // 超级管理员信息
    const superAdminData = {
      username: 'zcd',
      email: 'zcd@admin.com',
      password: 'asd123..',
      role: 'super_admin',
      status: 'active'
    }

    // 查找用户是否已存在
    let user = await User.findOne({ username: superAdminData.username })
    
    if (user) {
      console.log('⚠️  用户已存在，更新为超级管理员...')
      user.role = 'super_admin'
      user.status = 'active'
      await user.save()
      console.log('✅ 用户已升级为超级管理员')
    } else {
      // 创建新的超级管理员
      user = await User.create(superAdminData)
      console.log('✅ 超级管理员账号创建成功！')
    }

    console.log('\n========== 超级管理员信息 ==========')
    console.log(`  用户名: ${user.username}`)
    console.log(`  邮箱: ${user.email}`)
    console.log(`  密码: asd123..`)
    console.log(`  角色: ${user.role}`)
    console.log(`  状态: ${user.status}`)
    console.log('=====================================\n')
    console.log('🎉 现在可以使用此账号登录后台管理系统！')
    console.log('🔗 后台地址: http://localhost:3000/admin')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ 错误:', error)
    process.exit(1)
  }
}

createSuperAdmin()
