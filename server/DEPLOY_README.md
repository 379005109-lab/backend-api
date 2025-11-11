# 后端部署说明 - Sealos平台

## 📦 快速部署（5分钟）

### 前提条件
- Sealos账号
- 后端应用名称：`rtmfnnrfbmyt`
- 后端域名：`rtmfnnrfbmyt.sealoshzh.site`

### 部署步骤

#### 1. 登录Sealos
访问：https://cloud.sealos.io/

#### 2. 找到/创建应用
- 如果 `rtmfnnrfbmyt` 已存在：进入应用设置
- 如果不存在：创建新的 Node.js 应用

#### 3. 配置环境变量（复制粘贴）
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/furniture-ecommerce?authSource=admin
JWT_SECRET=furniture-ecommerce-super-secret-jwt-key-2024-change-in-production
JWT_EXPIRE=30d
CORS_ORIGIN=https://dlzrpxrppejh.sealoshzh.site
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

#### 4. 上传代码
将整个 `server` 目录上传，或使用打包文件：
- 位置：`/home/devbox/project/backend-deploy.tar.gz`
- 上传后解压到应用根目录

#### 5. 配置启动命令
```bash
npm install --production && node src/server.js
```

#### 6. 配置端口映射
- 容器端口：`5000`
- 外部访问：`80` 或 `443`

#### 7. 保存并重启应用

### 验证部署

等待2分钟后执行以下命令验证：

```bash
# 1. 健康检查（应返回success: true）
curl https://rtmfnnrfbmyt.sealoshzh.site/health

# 2. API信息（应返回API版本信息）
curl https://rtmfnnrfbmyt.sealoshzh.site/api/

# 3. 登录测试（应返回token）
curl -X POST https://rtmfnnrfbmyt.sealoshzh.site/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"zcd@admin.com","password":"asd123.."}'

# 4. 分类列表（应返回分类数据）
curl https://rtmfnnrfbmyt.sealoshzh.site/api/categories
```

**所有测试都应返回JSON格式数据，不应出现 "Cannot GET/POST" 错误**

### 前端测试
1. 访问：https://dlzrpxrppejh.sealoshzh.site/admin
2. 登录：zcd / asd123..
3. 尝试创建商品 - 应该可以成功保存

---

## 🔧 技术细节

### 应用架构
```
Express.js 服务器
  ├── src/server.js         - 入口文件
  ├── src/routes/           - 路由模块
  │   ├── index.js         - 路由总汇
  │   ├── auth.js          - 认证路由
  │   ├── products.js      - 商品路由
  │   ├── categories.js    - 分类路由
  │   └── ...
  ├── src/controllers/      - 控制器
  ├── src/models/          - 数据模型
  ├── src/middleware/      - 中间件
  └── src/config/          - 配置文件
```

### 关键文件说明

**package.json**
```json
{
  "name": "furniture-ecommerce-server",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

**src/server.js**
- 监听端口：5000
- 路由前缀：/api
- 健康检查：/health
- CORS配置：允许前端域名跨域

### 环境变量说明

| 变量 | 值 | 说明 |
|------|-----|------|
| NODE_ENV | production | 生产环境 |
| PORT | 5000 | 服务端口（必须） |
| MONGODB_URI | mongodb://... | 数据库连接 |
| JWT_SECRET | furniture-... | JWT密钥（重要） |
| CORS_ORIGIN | https://dlzrpxrppejh... | 前端域名 |

---

## 🐛 故障排查

### 问题：应用启动失败
**检查：**
- 环境变量是否全部设置
- MongoDB连接字符串是否正确
- 日志中的具体错误信息

### 问题：404错误
**检查：**
- 启动命令是否正确
- src/routes/index.js 是否存在
- 是否上传了完整的代码

### 问题：CORS错误
**检查：**
- CORS_ORIGIN 是否设置为前端域名
- 是否包含 https://

### 问题：认证失败
**检查：**
- JWT_SECRET 是否与本地一致
- 用户是否重新登录

---

## 📊 预期结果

部署成功后，以下端点应该都能正常工作：

- ✅ GET  /health
- ✅ GET  /api/
- ✅ POST /api/auth/login
- ✅ POST /api/auth/register
- ✅ GET  /api/products
- ✅ POST /api/products （需要认证）
- ✅ PUT  /api/products/:id （需要认证）
- ✅ GET  /api/categories
- ✅ GET  /api/materials
- ✅ GET  /api/orders

**前端功能**：
- ✅ 登录后台
- ✅ 查看商品列表
- ✅ 创建新商品
- ✅ 编辑商品
- ✅ 管理分类
- ✅ 管理素材

---

**部署准备时间**：2025-11-10  
**本地验证状态**：✅ 所有功能正常  
**预计部署时间**：5-10分钟
