require('dotenv').config();
const mongoose = require('mongoose');
const MaterialCategory = require('./models/MaterialCategory');

async function initMaterialCategories() {
  try {
    console.log('🔄 正在连接数据...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ 数据库连接成功');

    // 检查现有分类数量
    const existingCount = await MaterialCategory.countDocuments();
    console.log(`📊 当前材质分类数量: ${existingCount}`);

    if (existingCount > 0) {
      console.log('⚠️  数据库中已有材质分类数据，将清空并重新初始化...');
      await MaterialCategory.deleteMany({});
      console.log('🗑️  已清空现有材质分类');
    }

    // 创建默认材质分类
    const defaultCategories = [
      { name: '木材', parentId: null, order: 1 },
      { name: '石材', parentId: null, order: 2 },
      { name: '金属', parentId: null, order: 3 },
      { name: '布艺', parentId: null, order: 4 },
      { name: '皮革', parentId: null, order: 5 },
      { name: '玻璃', parentId: null, order: 6 },
    ];

    console....');
    const createdCategories = await MaterialCategory.insertMany(defaultCategories);
    console.log(`✅ 成功创建 ${createdCategories.length} 个材质分类`);

    // 显示创建的分类
    console.log('\n📋 材质分类列表:');
    createdCategories.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.name} (ID: ${cat._id})`);
    });

    console.log('\n🎉 材质分类初始化完成！');
    
    await mongoose.connection.close();
    console.log('📪 数据库连接已关闭');
    process.exit(0);
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

initMaterialCategories();
