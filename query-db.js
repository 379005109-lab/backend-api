// 临时脚本：直接查询MongoDB数据库
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function queryDatabase() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ 成功连接到MongoDB');
    console.log(`📊 数据库: ${mongoose.connection.name}`);
    console.log(`🔗 主机: ${mongoose.connection.host}`);
    console.log('');
    
    // 获取集合统计
    const count = await Product.countDocuments();
    console.log(`📦 总商品数量: ${count}`);
    console.log('');
    
    // 查询所有商品
    console.log('=== 商品列表 ===');
    const products = await Product.find().sort({ createdAt: -1 }).limit(10);
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.productName} (${product.model})`);
      console.log(`   ID: ${product._id}`);
      console.log(`   类别: ${product.category}`);
      console.log(`   标价: ¥${product.listPrice}`);
      console.log(`   库存: ${product.stock}`);
      console.log(`   创建时间: ${product.createdAt}`);
    });
    
    console.log('\n=== 按类别统计 ===');
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$listPrice' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    categories.forEach(cat => {
      console.log(`${cat._id}: ${cat.count}个商品, 平均价格: ¥${cat.avgPrice.toFixed(2)}`);
    });
    
    // 查询最新添加的商品
    console.log('\n=== 最新添加的3个商品 ===');
    const latest = await Product.find().sort({ createdAt: -1 }).limit(3);
    latest.forEach(p => {
      console.log(`- ${p.productName} (${p.model}) - ${p.createdAt}`);
    });
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ 数据库连接已关闭');
  }
}

queryDatabase();
