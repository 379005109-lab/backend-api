import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/furniture-ecommerce', {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })

    console.log(`✅ MongoDB已连接: ${conn.connection.host}`)
    
    // 监听数据库事件
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB连接错误:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB已断开连接')
    })

  } catch (error) {
    console.error('❌ MongoDB连接失败:', error.message)
    console.error('⚠️  请确保 MongoDB 服务正在运行')
    console.error('⚠️  服务器将继续启动，但数据库功能将不可用')
    // 不再退出进程，允许服务器继续运行
    // process.exit(1)
  }
}

export default connectDB

