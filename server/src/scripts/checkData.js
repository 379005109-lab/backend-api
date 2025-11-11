import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Material from '../models/Material.js'
import MaterialCategory from '../models/MaterialCategory.js'
import User from '../models/User.js'

// 加载环境变量
dotenv.config()

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    
    console.log('\n========================================')
    console.log('📊 云端数据库状态检查')
    console.log('========================================\n')
    
    console.log('🔗 连接信息:')
    console.log(`   数据库地址: ${process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@')}`)
    console.log(`   连接状态: ✅ 已连接\n`)
    
    // 统计数据
    const productCount = await Product.countDocuments()
    const categoryCount = await Category.countDocuments()
    const materialCount = await Material.countDocuments()
    const materialCategoryCount = await MaterialCategory.countDocuments()
    const userCount = await User.countDocuments()
    
    console.log('📈 数据统计:')
    console.log(`   👤 用户账号: ${userCount} 个`)
    console.log(`   📦 商品: ${productCount} 个`)
    console.log(`   📁 分类: ${categoryCount} 个`)
    console.log(`   🎨 材质: ${materialCount} 个`)
    console.log(`   🏷️  材质分类: ${materialCategoryCount} 个\n`)
    
    // 详细商品信息
    if (productCount > 0) {
      console.log('📦 商品列表:')
      const products = await Product.find().limit(10)
      products.forEach((p, index) => {
        console.log(`   ${index + 1}. ${p.name}`)
        console.log(`      分类: ${p.category} | 风格: ${p.style}`)
        console.log(`      价格: ¥${p.basePrice} | SKU数: ${p.skus?.length || 0}`)
      })
      if (productCount > 10) {
        console.log(`   ... 还有 ${productCount - 10} 个商品`)
      }
      console.log()
    } else {
      console.log('💡 提示: 数据库为空，请添加商品数据')
      console.log('   方式1: 使用Excel表格批量导入')
      console.log('   方式2: 在后台管理中手动添加')
      console.log('   方式3: 运行 npm run seed 添加示例数据\n')
    }
    
    // 用户信息
    const superAdmins = await User.find({ role: 'super_admin' })
    if (superAdmins.length > 0) {
      console.log('👑 超级管理员账号:')
      superAdmins.forEach(admin => {
        console.log(`   • ${admin.username} (${admin.email})`)
      })
      console.log()
    }
    
    console.log('✅ 数据存储在云端MongoDB，永久保存')
    console.log('========================================\n')
    
    process.exit(0)
  } catch (error) {
    console.error('\n❌ 连接失败:', error.message)
    console.error('请检查MongoDB服务是否正常运行\n')
    process.exit(1)
  }
}

checkData()
