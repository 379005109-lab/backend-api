import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Category from '../models/Category.js'
import MaterialCategory from '../models/MaterialCategory.js'
import Material from '../models/Material.js'
import Product from '../models/Product.js'

// 加载环境变量
dotenv.config()

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB已连接')

    // 检查命令行参数
    const shouldClear = process.argv.includes('--clear')
    
    if (shouldClear) {
      console.log('\n🗑️  正在清空现有数据...')
      await Category.deleteMany({})
      await MaterialCategory.deleteMany({})
      await Material.deleteMany({})
      await Product.deleteMany({})
      console.log('✅ 已清空现有数据')
    } else {
      // 检查是否已有数据
      const categoryCount = await Category.countDocuments()
      const materialCount = await Material.countDocuments()
      const productCount = await Product.countDocuments()
      
      if (categoryCount > 0 || materialCount > 0 || productCount > 0) {
        console.log('\n⚠️  数据库中已有数据：')
        console.log(`   商品分类: ${categoryCount} 个`)
        console.log(`   材质: ${materialCount} 个`)
        console.log(`   商品: ${productCount} 个`)
        console.log('\n💡 如需重新初始化，请运行: npm run seed -- --clear')
        process.exit(0)
      }
    }

    // ============ 1. 创建商品分类 ============
    console.log('\n📁 创建商品分类...')
    const categories = await Category.create([
      {
        name: '沙发',
        slug: 'sofa',
        description: '舒适的客厅沙发',
        status: 'active',
        order: 1,
        level: 1,
      },
      {
        name: '床',
        slug: 'bed',
        description: '优质睡眠床具',
        status: 'active',
        order: 2,
        level: 1,
      },
      {
        name: '桌子',
        slug: 'table',
        description: '实用的桌子家具',
        status: 'active',
        order: 3,
        level: 1,
      },
      {
        name: '椅子',
        slug: 'chair',
        description: '舒适的座椅',
        status: 'active',
        order: 4,
        level: 1,
      },
      {
        name: '柜子',
        slug: 'cabinet',
        description: '储物柜系列',
        status: 'active',
        order: 5,
        level: 1,
      },
      {
        name: '灯具',
        slug: 'lighting',
        description: '照明灯具',
        status: 'active',
        order: 6,
        level: 1,
      },
    ])
    console.log(`✅ 已创建 ${categories.length} 个商品分类`)

    // ============ 2. 创建材质分类 ============
    console.log('\n📁 创建材质分类...')
    const materialCategories = await MaterialCategory.create([
      {
        name: '木材',
        icon: '🪵',
        order: 1,
      },
      {
        name: '金属',
        icon: '⚙️',
        order: 2,
      },
      {
        name: '布料',
        icon: '🧵',
        order: 3,
      },
      {
        name: '皮革',
        icon: '👜',
        order: 4,
      },
      {
        name: '玻璃',
        icon: '🪟',
        order: 5,
      },
      {
        name: '塑料',
        icon: '🔧',
        order: 6,
      },
    ])
    console.log(`✅ 已创建 ${materialCategories.length} 个材质分类`)

    // ============ 3. 创建材质 ============
    console.log('\n🎨 创建材质...')
    const materials = await Material.create([
      // 木材类
      {
        name: '橡木',
        type: 'texture',
        image: 'https://images.unsplash.com/photo-1565538420870-da08ff96a207?w=400',
        categoryId: materialCategories[0]._id,
        categoryName: '木材',
        tags: ['天然', '耐用'],
        description: '优质橡木材质，坚固耐用',
        price: 200,
        status: 'approved',
        order: 1,
      },
      {
        name: '胡桃木',
        type: 'texture',
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400',
        categoryId: materialCategories[0]._id,
        categoryName: '木材',
        tags: ['高端', '深色'],
        description: '深色胡桃木，质感高级',
        price: 350,
        status: 'approved',
        order: 2,
      },
      // 金属类
      {
        name: '不锈钢',
        type: 'texture',
        image: 'https://images.unsplash.com/photo-1567225591450-716a2520d3b8?w=400',
        categoryId: materialCategories[1]._id,
        categoryName: '金属',
        tags: ['现代', '防锈'],
        description: '高品质不锈钢材质',
        price: 150,
        status: 'approved',
        order: 1,
      },
      {
        name: '黄铜',
        type: 'texture',
        image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400',
        categoryId: materialCategories[1]._id,
        categoryName: '金属',
        tags: ['复古', '豪华'],
        description: '复古黄铜材质',
        price: 280,
        status: 'approved',
        order: 2,
      },
      // 布料类
      {
        name: '亚麻布',
        type: 'texture',
        image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400',
        categoryId: materialCategories[2]._id,
        categoryName: '布料',
        tags: ['透气', '天然'],
        description: '天然亚麻布料',
        price: 120,
        status: 'approved',
        order: 1,
      },
      {
        name: '绒布',
        type: 'texture',
        image: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=400',
        categoryId: materialCategories[2]._id,
        categoryName: '布料',
        tags: ['柔软', '舒适'],
        description: '柔软舒适绒布',
        price: 180,
        status: 'approved',
        order: 2,
      },
      // 皮革类
      {
        name: '真皮',
        type: 'texture',
        image: 'https://images.unsplash.com/photo-1551037641-fb0c51ba98eb?w=400',
        categoryId: materialCategories[3]._id,
        categoryName: '皮革',
        tags: ['高端', '耐用'],
        description: '优质真皮材质',
        price: 500,
        status: 'approved',
        order: 1,
      },
      {
        name: 'PU皮',
        type: 'texture',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
        categoryId: materialCategories[3]._id,
        categoryName: '皮革',
        tags: ['实惠', '易清洁'],
        description: 'PU皮革材质',
        price: 150,
        status: 'approved',
        order: 2,
      },
    ])
    console.log(`✅ 已创建 ${materials.length} 个材质`)

    // ============ 4. 创建示例商品 ============
    console.log('\n🛋️  创建示例商品...')
    const products = await Product.create([
      {
        name: '现代简约布艺沙发',
        description: '北欧风格设计，舒适布艺材质，适合现代简约风格家居',
        category: 'sofa',
        style: 'modern',
        basePrice: 3999,
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        ],
        status: 'active',
        tags: ['现代', '简约', '舒适'],
        skus: [
          {
            color: '灰色',
            material: '亚麻布',
            materialId: materials[4]._id,
            price: 3999,
            stock: 20,
            images: [],
          },
          {
            color: '米色',
            material: '绒布',
            materialId: materials[5]._id,
            price: 4299,
            stock: 30,
            images: [],
          },
        ],
      },
      {
        name: '实木大床',
        description: '优质橡木框架，坚固耐用，给您舒适的睡眠体验',
        category: 'bed',
        style: 'scandinavian',
        basePrice: 5999,
        images: [
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
        ],
        status: 'active',
        tags: ['实木', '北欧', '耐用'],
        skus: [
          {
            color: '原木色',
            material: '橡木',
            materialId: materials[0]._id,
            price: 5999,
            stock: 15,
            images: [],
          },
          {
            color: '深棕色',
            material: '胡桃木',
            materialId: materials[1]._id,
            price: 7999,
            stock: 15,
            images: [],
          },
        ],
      },
      {
        name: '北欧实木餐桌',
        description: '简约设计，优质橡木材质，适合4-6人使用',
        category: 'dining',
        style: 'scandinavian',
        basePrice: 2999,
        images: [
          'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800',
        ],
        status: 'active',
        tags: ['北欧', '实木', '简约'],
        skus: [
          {
            color: '原木色',
            material: '橡木',
            materialId: materials[0]._id,
            price: 2999,
            stock: 20,
            images: [],
          },
          {
            color: '深色',
            material: '胡桃木',
            materialId: materials[1]._id,
            price: 3999,
            stock: 20,
            images: [],
          },
        ],
      },
      {
        name: '舒适办公椅',
        description: '人体工学设计，久坐不累，网布透气材质',
        category: 'chair',
        style: 'modern',
        basePrice: 899,
        images: [
          'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
        ],
        status: 'active',
        tags: ['办公', '舒适', '人体工学'],
        skus: [
          {
            color: '黑色',
            material: '亚麻布',
            materialId: materials[4]._id,
            price: 899,
            stock: 50,
            images: [],
          },
          {
            color: '灰色',
            material: '亚麻布',
            materialId: materials[4]._id,
            price: 899,
            stock: 50,
            images: [],
          },
        ],
      },
      {
        name: '现代储物柜',
        description: '多功能储物设计，大容量空间，金属配件耐用',
        category: 'storage',
        style: 'minimalist',
        basePrice: 1999,
        images: [
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800',
        ],
        status: 'active',
        tags: ['储物', '现代', '实用'],
        skus: [
          {
            color: '白色',
            material: '橡木',
            materialId: materials[0]._id,
            price: 1999,
            stock: 30,
            images: [],
          },
          {
            color: '灰色',
            material: '橡木',
            materialId: materials[0]._id,
            price: 2199,
            stock: 30,
            images: [],
          },
        ],
      },
      {
        name: '工业风铁艺书桌',
        description: '复古工业风设计，金属框架结实稳固',
        category: 'desk',
        style: 'industrial',
        basePrice: 1599,
        images: [
          'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
        ],
        status: 'active',
        tags: ['工业风', '书桌', '金属'],
        skus: [
          {
            color: '黑色',
            material: '不锈钢',
            materialId: materials[2]._id,
            price: 1599,
            stock: 25,
            images: [],
          },
          {
            color: '古铜色',
            material: '黄铜',
            materialId: materials[3]._id,
            price: 1999,
            stock: 15,
            images: [],
          },
        ],
      },
    ])
    console.log(`✅ 已创建 ${products.length} 个示例商品`)

    // ============ 统计信息 ============
    console.log('\n========== 数据初始化完成 ==========')
    console.log(`📁 商品分类: ${categories.length} 个`)
    console.log(`📁 材质分类: ${materialCategories.length} 个`)
    console.log(`🎨 材质: ${materials.length} 个`)
    console.log(`🛋️  商品: ${products.length} 个`)
    console.log('=====================================\n')
    console.log('🎉 数据初始化成功！现在可以在后台管理系统中查看数据了')

    process.exit(0)
  } catch (error) {
    console.error('❌ 错误:', error)
    process.exit(1)
  }
}

seedData()
