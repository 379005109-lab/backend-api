// 测试登录功能
const testLogin = async () => {
  try {
    console.log('测试超级管理员登录...');
    
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
      console.log('✓ 登录成功！');
      console.log('Token:', result.data.token.substring(0, 30) + '...');
      console.log('用户信息:');
      console.log('  - 用户名:', result.data.user.username);
      console.log('  - 角色:', result.data.user.role);
      console.log('  - ID:', result.data.user.id);
    } else {
      console.log('✗ 登录失败:', result.error);
    }
  } catch (error) {
    console.error('✗ 测试失败:', error.message);
  }
};

testLogin();
