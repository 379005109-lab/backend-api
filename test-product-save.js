const mongoose = require('mongoose');
const Product = require('./models/Product');

// 连接数据库
const MONGODB_URI = 'mongodb://test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db';

async function testProductSave() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 连接成功\n');

    // 测试数据 - 模拟前端提交的数据
    const testProduct = {
      productName: '测试商品',
      model: 'TEST-001',
      category: '测试类别',
      listPrice: 1000,
      stock: 10,
      specifications: '测试规格',
      videos: [
        'https://www.youtube.com/watch?v=test1',
        'https://www.youtube.com/watch?v=test2'
      ],
      files: [
        {
          name: '测试文件1.pdf',
          url: 'https://example.com/file1.pdf',
          uploadTime: new Date().toISOString()
        },
        {
          name: '测试文件2.pdf',
          url: 'https://example.com/file2.pdf',
          uploadTime: new Date().toISOString()
        }
      ]
    };

    console.log('📝 测试数据:');
    console.log(JSON.stringify(testProduct, null, 2));
    console.log('\n数据大小:', JSON.stringify(testProduct).length, '字节\n');

    // 尝试创建产品
    console.log('🔄 正在创建产品...');
    const product = await Product.create(testProduct);
    console.log('✅ 产品创建成功!');
    console.log('产品 ID:', product._id);
    console.log('视频数量:', product.videos?.length || 0);
    console.log('文件数量:', product.files?.length || 0);

    // 测试更新
    console.log('\n🔄 正在测试更新...');
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        videos: [...(product.videos || []), 'https://www.youtube.com/watch?v=test3'],
        files: [...(product.files || []), {
          name: '测试文件3.pdf',
          url: 'https://example.com/file3.pdf',
          uploadTime: new Date().toISOString()
        }]
      },
      { new: true }
    );
    console.log('✅ 产品更新成功!');
    console.log('更新后视频数量:', updatedProduct.videos?.length || 0);
    console.log('更新后文件数量:', updatedProduct.files?.length || 0);

    // 清理测试数据
    console.log('\n🗑️  清理测试数据...');
    await Product.findByIdAndDelete(product._id);
    console.log('✅ 清理完成\n');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('错误详情:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 数据库连接已关闭');
  }
}

testProductSave();
