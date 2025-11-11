const API_URL = 'https://dlzrpxrppejh.sealoshzh.site/api/products';

const products = [
  {
    productName: "云端现代简约沙发",
    model: "CLOUD-SF-001",
    category: "沙发",
    specifications: "三人位",
    dimensions: "220cm x 90cm x 85cm",
    material: "高档布艺",
    listPrice: 12888,
    stock: 15,
    isPro: false
  },
  {
    productName: "云端智能按摩椅",
    model: "CLOUD-MC-002",
    category: "椅子",
    specifications: "全身按摩",
    dimensions: "120cm x 80cm x 110cm",
    material: "真皮",
    listPrice: 25888,
    stock: 8,
    isPro: true,
    proFeatures: "AI智能按摩系统，语音控制，零重力模式"
  },
  {
    productName: "云端实木餐桌",
    model: "CLOUD-TB-003",
    category: "桌子",
    specifications: "六人餐桌",
    dimensions: "180cm x 90cm x 75cm",
    material: "北美黑胡桃木",
    listPrice: 18888,
    stock: 12,
    isPro: false
  },
  {
    productName: "云端欧式床架",
    model: "CLOUD-BD-004",
    category: "床",
    specifications: "1.8米双人床",
    dimensions: "200cm x 180cm x 120cm",
    material: "实木+皮艺软包",
    listPrice: 15888,
    stock: 10,
    isPro: false
  },
  {
    productName: "云端智能衣柜",
    model: "CLOUD-WR-005",
    category: "柜子",
    specifications: "四门智能衣柜",
    dimensions: "240cm x 60cm x 220cm",
    material: "E0级环保板材",
    listPrice: 28888,
    stock: 5,
    isPro: true,
    proFeatures: "智能除湿，自动灯光，APP控制"
  }
];

async function addProduct(product) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product)
    });
    
    const data = await response.text();
    console.log(`✅ 添加成功: ${product.productName}`);
    console.log(`   响应: ${data}`);
    return true;
  } catch (error) {
    console.error(`❌ 添加失败: ${product.productName}`, error.message);
    return false;
  }
}

async function main() {
  console.log('开始向云端API添加测试数据...\n');
  
  for (const product of products) {
    await addProduct(product);
    await new Promise(resolve => setTimeout(resolve, 500)); // 延迟500ms
  }
  
  console.log('\n所有数据添加完成！');
  console.log('\n验证数据...');
  
  try {
    const response = await fetch(API_URL);
    const result = await response.json();
    console.log(`\n✅ 云端商品总数: ${result.data.length}`);
    result.data.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.productName} (${p.model}) - ¥${p.listPrice}`);
    });
  } catch (error) {
    console.error('验证失败:', error.message);
  }
}

main();
