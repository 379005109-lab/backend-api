# 前端连接后端配置指南

## ✅ 已完成的配置

### 1. 后端端口修改
- ✅ 后端已从 **5000端口** 改为 **3000端口**
- ✅ 服务器正在运行：`http://0.0.0.0:3000`

### 2. CORS配置
- ✅ 已配置允许您的前端域名访问：
  - `https://dlzrpxrppejh.sealoshzh.site`
  - 所有 `.sealoshzh.site` 子域名
  - 本地开发环境 `localhost:3000` 和 `localhost:5000`

### 3. PM2自动启动
- ✅ 服务器会在打开Windsurf时自动启动
- ✅ 端口配置已保存

## 🔧 前端需要的配置

### 方案1：通过Sealos Devbox外网地址访问（推荐）

在Sealos平台中，您的Devbox应该有一个对外访问的URL。请按以下步骤操作：

1. **在Sealos控制台查找Devbox的外网地址：**
   - 打开Sealos控制台
   - 找到您的Devbox：`houduanceshi`
   - 查看网络配置，找到3000端口对应的外网URL
   - 例如可能是：`https://xxxx.sealoshzh.site` 或 `https://houduanceshi-xxx.sealoshzh.site`

2. **在前端配置API基础URL：**
   ```javascript
   // 前端配置文件（例如 .env 或 config.js）
   const API_BASE_URL = 'https://your-devbox-url.sealoshzh.site';
   // 或者如果有端口映射
   const API_BASE_URL = 'https://your-devbox-url.sealoshzh.site:3000';
   ```

### 方案2：使用内网地址（仅限同一Sealos集群）

如果前端也部署在同一个Sealos集群中，可以使用内网地址：
```javascript
const API_BASE_URL = 'http://houduanceshi:3000';
```

### 方案3：配置Sealos网络入口

在Sealos中为后端配置Ingress：
1. 在Sealos控制台创建网络入口
2. 将3000端口映射到外网域名
3. 在前端使用该域名

## 🧪 测试后端连接

### 本地测试（在Devbox内）
```bash
# 健康检查
curl http://localhost:3000/health

# API根路径
curl http://localhost:3000/

# 获取用户列表
curl http://localhost:3000/api/users
```

### 从前端测试
在浏览器控制台或前端代码中：
```javascript
// 测试API连接
fetch('YOUR_BACKEND_URL/health')
  .then(res => res.json())
  .then(data => console.log('Backend连接成功:', data))
  .catch(err => console.error('Backend连接失败:', err));
```

## 📋 API端点列表

所有API端点都需要加上基础URL前缀。

### 健康检查
- `GET /health` - 检查服务器状态

### 用户管理
- `GET /api/users` - 获取所有用户
- `GET /api/users/:id` - 根据ID获取用户
- `POST /api/users` - 创建新用户
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户

## 🔍 常见问题排查

### 问题1：前端访问后端返回CORS错误
**解决方案：**
- ✅ 已配置CORS，允许您的前端域名
- 确认前端域名是 `https://dlzrpxrppejh.sealoshzh.site`
- 如果前端域名不同，需要更新 `server.js` 中的CORS配置

### 问题2：连接超时或无法访问
**可能原因：**
1. Devbox的3000端口未对外暴露
2. 前端配置的API地址不正确
3. 防火墙或网络策略限制

**解决步骤：**
1. 确认Devbox的网络配置
2. 检查Sealos控制台的端口映射
3. 确认API地址配置正确

### 问题3：服务器未运行
**检查服务器状态：**
```bash
pm2 list           # 查看PM2进程
pm2 logs backend-api  # 查看日志
```

**重启服务器：**
```bash
pm2 restart backend-api
```

## 📝 前端环境变量示例

### React/.env
```env
REACT_APP_API_URL=https://your-backend-url.sealoshzh.site
```

### Vue/.env
```env
VUE_APP_API_URL=https://your-backend-url.sealoshzh.site
```

### Next.js/.env
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.sealoshzh.site
```

### Vite/.env
```env
VITE_API_URL=https://your-backend-url.sealoshzh.site
```

## 🚀 下一步操作

1. **找到您的Devbox外网地址**
   - 在Sealos控制台查看
   - 或者联系Sealos管理员

2. **更新前端配置**
   - 将后端URL配置为Devbox的外网地址
   - 重新部署前端应用

3. **测试连接**
   - 访问前端网站
   - 检查浏览器控制台是否有错误
   - 测试API调用是否成功

## 💡 提示

- 后端已配置为监听 `0.0.0.0:3000`，可以接受来自任何IP的连接
- CORS已正确配置，支持您的前端域名
- 服务器会在Windsurf打开时自动启动，无需手动操作
- 如需修改CORS配置，编辑 `server.js` 文件并重启服务器

---

**当前后端状态：** ✅ 运行中
**监听端口：** 3000
**访问地址（本地）：** http://localhost:3000
**MongoDB：** 已连接
