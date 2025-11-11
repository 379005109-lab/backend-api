// 测试向公网API添加最简单的数据
const products = [
  {
    productName: "简约沙发",
    model: "SF001",
    category: "沙发",
    listPrice: 5000
  },
  {
    productName: "实木餐桌",
    model: "CZ001",
    category: "桌子",
    listPrice: 3000
  },
  {
    productName: "布艺床",
    model: "BC001",
    category: "床",
    listPrice: 4000
  },
  {
    productName: "现代椅子",
    model: "YZ001",
    category: "椅子",
    listPrice: 800
  },
  {
    productName: "储物柜",
    model: "GZ001",
    category: "柜子",
    listPrice: 2000
  }
];

async function addProduct(product) {
  try {
    const response = await fetch('https://dlzrpxrppejh.sealoshzh.site/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product)
    });
    
    const text = await response.text();
    
    if (response.ok) {
      console.log(`✅ ${product.productName} - 添加成功`);
      return true;
    } else {
      console.log(`❌ ${product.productName} - 失败: ${text}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${product.productName} - 错误: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('开始添加测试数据到公网API...\n');
  
  let successCount = 0;
  for (const product of products) {
    const success = await addProduct(product);
    if (success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n完成！成功添加 ${successCount}/${products.length} 个商品`);
  
  // 验证
  console.log('\n验证数据...');
  const response = await fetch('https://dlzrpxrppejh.sealoshzh.site/api/products');
  const result = await response.json();
  console.log(`当前商品总数: ${result.data.length}`);
}

main().catch(console.error);
