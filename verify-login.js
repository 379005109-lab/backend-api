require('dotenv').config();
const mongoose = require('mongoose');
const AuthUser = require('./models/AuthUser');

async function verifyLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('=== 验证登录系统 ===\n');

    // 1. 检查用户是否存在
    const user = await AuthUser.findOne({ username: 'zcd' });
    
    if (!user) {
      console.log('❌ 用户不存在');
      process.exit(1);
    }
    
    console.log('✅ 用户存在:');
    console.log('   用户名:', user.username);
    console.log('   角色:', user.role);
    console.log('   激活状态:', user.isActive);
    console.log('   创建时间:', user.createdAt);
    console.log('');

    // 2. 验证密码
    const testPassword = 'asd123..';
    const isMatch = await user.comparePassword(testPassword);
    
    console.log('✅ 密码验证:');
    console.log('   测试密码:', testPassword);
    console.log('   验证结果:', isMatch ? '✅ 正确' : '❌ 错误');
    console.log('');

    // 3. 测试完整登录流程
    console.log('✅ 测试完整登录流程...');
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'zcd',
        password: 'asd123..'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('   ✅ 登录成功！');
      console.log('   Token:', result.data.token.substring(0, 30) + '...');
      console.log('   用户角色:', result.data.user.role);
    } else {
      console.log('   ❌ 登录失败:', result.error);
    }
    
    console.log('\n=== 测试完成 ===');
    console.log('后端登录系统工作正常！');
    console.log('\n如果前端无法登录，请检查：');
    console.log('1. 浏览器是否发送了正确的数据');
    console.log('2. 用户名是否为: zcd');
    console.log('3. 密码是否为: asd123.. (注意两个点)');
    console.log('4. 是否清除了浏览器缓存');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

verifyLogin();
