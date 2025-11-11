import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import errorHandler from './middleware/errorHandler.js'
import routes from './routes/index.js'

// 加载环境变量
dotenv.config()

// 创建Express应用
const app = express()

// 连接数据库
connectDB()

// 中间件
app.use(helmet()) // 安全头
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))
app.use(compression()) // 压缩响应
app.use(morgan('dev')) // 日志
app.use(express.json({ limit: '50mb' })) // 解析JSON，支持大文件（最大50MB）
app.use(express.urlencoded({ extended: true, limit: '50mb' })) // 解析URL编码

// 静态文件
app.use('/uploads', express.static('uploads'))

// API路由
app.use('/api', routes)

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: '服务运行正常',
    timestamp: new Date().toISOString(),
  })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
  })
})

// 错误处理
app.use(errorHandler)

// 启动服务器
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`)
  console.log(`📝 环境: ${process.env.NODE_ENV}`)
  console.log(`🔗 API地址: http://localhost:${PORT}/api`)
})

export default app

