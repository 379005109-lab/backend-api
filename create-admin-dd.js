import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = 'mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin'

async function createAdmin() {
  try {
    console.log('🔌 连接数据库...')
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    console.log('✅ 数据库连接成功')

    const db = mongoose.connection.db
    const usersCollection = db.collection('users')

    // 先删除旧的 'd' 用户（如果存在）
    await usersCollection.deleteOne({ username: 'd' })
    console.log('🗑️  已删除旧用户 "d"（如果存在）')

    // 检查 'dd' 用户是否存在
    const existing = await usersCollection.findOne({ username: 'dd' })
    
    if (existing) {
      console.log('⚠️  用户 "dd" 已存在，更新为超级管理员...')
      
      // 加密密码
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash('asd123..', salt)
      
      await usersCollection.updateOne(
        { username: 'dd' },
        { 
          $set: { 
            role: 'super_admin',
            status: 'active',
            password: hashedPassword,
            phone: '13800000001',
            email: 'dd@admin.com'
          }
        }
      )
      console.log('✅ 已更新为超级管理员')
    } else {
      console.log('➕ 创建新的超级管理员...')
      
      // 加密密码
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash('asd123..', salt)
      
      await usersCollection.insertOne({
        username: 'dd',
        email: 'dd@admin.com',
        password: hashedPassword,
        phone: '13800000001',
        role: 'super_admin',
        status: 'active',
        avatar: '',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log('✅ 超级管理员创建成功')
    }

    // 查询所有超级管理员
    const admins = await usersCollection.find({ role: 'super_admin' }).toArray()
    console.log('\n📋 当前所有超级管理员:')
    admins.forEach(admin => {
      console.log(`  - ${admin.username} (${admin.email})`)
    })

    await mongoose.connection.close()
    console.log('\n✅ 完成！')
    console.log('\n📝 登录信息:')
    console.log('   用户名: dd')
    console.log('   密码: asd123..')
    console.log('   手机号: 13800000001')
    
  } catch (error) {
    console.error('❌ 错误:', error.message)
    await mongoose.connection.close()
    process.exit(1)
  }
}

createAdmin()
