require('dotenv').config();
const mongoose = require('mongoose');
const AuthUser = require('./models/AuthUser');

// 创建超级管理员
async function createSuperAdmin() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('已连接到数据库');

    // 检查是否已存在该用户名
    const existingUser = await AuthUser.findOne({ username: 'zcd' });
    
    if (existingUser) {
      console.log('用户 zcd 已存在，正在更新...');
      existingUser.password = 'asd123..';
      existingUser.role = 'super_admin';
      existingUser.isActive = true;
      await existingUser.save();
      console.log('超级管理员账号已更新！');
    } else {
      // 创建超级管理员
      const superAdmin = await AuthUser.create({
        username: 'zcd',
        password: 'asd123..',
        role: 'super_admin',
        isActive: true
      });
      
      console.log('超级管理员创建成功！');
      console.log('用户名:', superAdmin.username);
      console.log('角色:', superAdmin.role);
    }
    
    // 显示所有用户
    const allUsers = await AuthUser.find().select('-password');
    console.log('\n当前所有用户:');
    console.log(JSON.stringify(allUsers, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('创建超级管理员失败:', error);
    process.exit(1);
  }
}

createSuperAdmin();
