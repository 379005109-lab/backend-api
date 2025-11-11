import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Order from '../models/Order.js'
import connectDB from '../config/database.js'

dotenv.config()

// 清空假订单数据
const clearFakeOrders = async () => {
  try {
    // 连接数据库
    await connectDB()
    
    console.log('正在查找假订单数据...')
    
    // 查找所有订单
    const allOrders = await Order.find({}).populate('user', 'username email')
    
    console.log(`找到 ${allOrders.length} 条订单`)
    
    if (allOrders.length > 0) {
      // 显示订单列表
      console.log('\n订单列表：')
      allOrders.forEach((order, index) => {
        console.log(`${index + 1}. 订单号: ${order.orderNo}, 用户: ${order.user?.username || '未知'}, 总额: ¥${order.totalAmount}, 状态: ${order.status}`)
      })
    }
    
    // 删除所有订单
    // 注意：这会删除所有订单，请谨慎操作
    const result = await Order.deleteMany({})
    
    console.log(`\n✅ 已删除 ${result.deletedCount} 条订单`)
    console.log('假订单数据已清空，现在可以创建真实订单了')
    
    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('清空订单失败:', error)
    process.exit(1)
  }
}

clearFakeOrders()

