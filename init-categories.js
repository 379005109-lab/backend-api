require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

async function initCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('已连接到数据库');

    // 删除现有分类
    await Category.deleteMany({});
    console.log('已清空现有分类');

    // 创建示例分类
    const categories = [
      {
        name: '沙发',
        slug: 'sofa',
        description: '各类沙发产品',
        level: 0,
        order: 1,
        icon: '🛋️',
        isActive: true
      },
      {
        name: '床',
        slug: 'bed',
        description: '床及床上用品',
        level: 0,
        order: 2,
        icon: '🛏️',
        isActive: true
      },
      {
        name: '桌子',
        slug: 'table',
        description: '各类桌子',
        level: 0,
        order: 3,
        icon: '🪑',
        isActive: true
      },
      {
        name: '椅子',
        slug: 'chair',
        description: '各类椅子',
        level: 0,
        order: 4,
        icon: '💺',
        isActive: true
      },
      {
        name: '柜子',
        slug: 'cabinet',
        description: '储物柜、衣柜等',
        level: 0,
        order: 5,
        icon: '🗄️',
        isActive: true
      }
    ];

    const created = await Category.insertMany(categories);
    console.log(`成功创建 ${created.length} 个分类`);

    // 创建子分类
    const sofaCategory = created.find(c => c.slug === 'sofa');
    const subCategories = [
      {
        name: '布艺沙发',
        slug: 'fabric-sofa',
        description: '布艺材质沙发',
        parentId: sofaCategory._id,
        level: 1,
        order: 1,
        isActive: true
      },
      {
        name: '皮质沙发',
        slug: 'leather-sofa',
        description: '真皮/仿皮沙发',
        parentId: sofaCategory._id,
        level: 1,
        order: 2,
        isActive: true
      },
      {
        name: '转角沙发',
        slug: 'corner-sofa',
        description: 'L型转角沙发',
        parentId: sofaCategory._id,
        level: 1,
        order: 3,
        isActive: true
      }
    ];

    const subCreated = await Category.insertMany(subCategories);
    console.log(`成功创建 ${subCreated.length} 个子分类`);

    // 显示分类树
    const allCategories = await Category.find().sort('order level');
    console.log('\n分类列表:');
    allCategories.forEach(cat => {
      const indent = '  '.repeat(cat.level);
      console.log(`${indent}- ${cat.icon || ''} ${cat.name} (${cat.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('初始化分类失败:', error);
    process.exit(1);
  }
}

initCategories();
