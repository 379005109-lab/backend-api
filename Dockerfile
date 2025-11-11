FROM node:22-alpine

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖（生产环境）
RUN npm ci --only=production && npm cache clean --force

# 复制应用代码
COPY . .

# 创建必要的目录
RUN mkdir -p /app/uploads /app/logs

# 设置环境变量
ENV NODE_ENV=production \
    PORT=5000

# 暴露端口
EXPOSE 5000

# 健康检查
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动命令
CMD ["node", "server.js"]
