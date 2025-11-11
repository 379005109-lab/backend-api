import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Material from '../models/Material.js'
import MaterialCategory from '../models/MaterialCategory.js'

// 加载环境变量
dotenv.config()

const clearSampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB已连接')
    console.log('🔗 连接地址:', process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@'))

    console.log('\n⚠️  准备清空示例数据...')
    console.log('此操作将删除所有商品、分类和材质数据')
    console.log('超级管理员账号不会被删除\n')

    // 统计当前数据
    const productCount = await Product.countDocuments()
    const categoryCount = await Category.countDocuments()
    const materialCount = await Material.countDocuments()
    const materialCategoryCount = await MaterialCategory.countDocuments()

    console.log('📊 当前数据统计:')
    console.log(`   商品: ${productCount} 个`)
    console.log(`   分类: ${categoryCount} 个`)
    console.log(`   材质: ${materialCount} 个`)
    console.log(`   材质分类: ${materialCategoryCount} 个\n`)

    // 清空数据
    console.log('🗑️  正在清空数据...')
    
    await Product.deleteMany({})
    console.log('✅ 已清空商品数据')
    
    await Category.deleteMany({})
    console.log('✅ 已清空分类数据')
    
    await Material.deleteMany({})
    console.log('✅ 已清空材质数据')
    
    await MaterialCategory.deleteMany({})
    console.log('✅ 已清空材质分类数据')

    // 验证清空结果
    const finalProductCount = await Product.countDocuments()
    const finalCategoryCount = await Category.countDocuments()
    const finalMaterialCount = await Material.countDocuments()
    const finalMaterialCategoryCount = await MaterialCategory.countDocuments()

    console.log('\n✅ 数据清空完成！')
    console.log('📊 清空后统计:')
    console.log(`   商品: ${finalProductCount} 个`)
    console.log(`   分类: ${finalCategoryCount} 个`)
    console.log(`   材质: ${finalMaterialCount} 个`)
    console.log(`   材质分类: ${finalMaterialCategoryCount} 个\n`)

    console.log('💡 接下来您可以：')
    console.log('   1. 在后台管理中手动添加数据')
    console.log('   2. 使用Excel表格导入数据')
    console.log('   3. 通过API创建数据\n')

    console.log('🔐 超级管理员账号保持不变:')
    console.log('   用户名: zcd')
    console.log('   密码: asd123..')
    console.log('   后台地址: http://localhost:3000/admin\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ 错误:', error)
    process.exit(1)
  }
}

clearSampleData()
