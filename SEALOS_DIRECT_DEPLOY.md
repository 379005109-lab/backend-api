# 🚀 Sealos 直接部署指南

## 📋 您的部署信息

### Git 仓库
```
https://github.com/379005109-lab/backend-api.git
```

### Sealos 控制台地址
```
https://cloud.sealos.run/
或
https://hzh.sealos.run/
```

### 您的命名空间
```
ns-cxxiwxce
```

---

## 🎯 在 Sealos App Launchpad 部署

### 方法 1：使用 Web 界面

1. **登录 Sealos**
   - 访问：https://cloud.sealos.run/
   - 使用您的账号登录

2. **打开 App Launchpad**
   - 在控制台找到 "应用管理" 或 "App Launchpad"
   - 点击进入

3. **创建新应用**
   - 点击 "创建应用" 或 "+ 新建"

4. **配置应用**

   **基本信息**：
   - 应用名称：`backend-api`
   - 部署方式：选择 "从代码仓库"

   **代码仓库**：
   - Git URL：`https://github.com/379005109-lab/backend-api.git`
   - 分支：`main`
   - 根目录：`/`

   **构建配置**：
   - 构建包类型：`Node.js` 或 `Dockerfile`
   - Node 版本：`22` 或 `Latest`
   - 安装命令：`npm install --production`
   - 启动命令：`node server.js`

   **网络配置**：
   - 容器端口：`5000`
   - 外网访问：开启

   **环境变量**（重要！）：
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin
   ```

   **资源配置**：
   - CPU：0.1 - 0.5 核
   - 内存：256Mi - 512Mi
   - 副本数：2

   **自动部署**：
   - ✅ 启用 Git 自动部署

5. **点击部署**

---

### 方法 2：使用 kubectl 命令行

如果您更熟悉命令行，可以使用之前创建的配置文件：

```bash
export KUBECONFIG="/home/devbox/project/kubeconfig (4).yaml"

# 应用 Kubernetes 配置
kubectl apply -f k8s/backend-deployment.yaml

# 查看部署状态
kubectl get pods -n ns-cxxiwxce
kubectl get svc -n ns-cxxiwxce
```

---

## 📊 部署后验证

### 查看应用状态

在 Sealos 控制台：
- 查看 Pod 运行状态
- 查看日志输出
- 获取访问域名

### 测试 API

```bash
# 获取应用域名后测试
curl https://YOUR_SEALOS_DOMAIN/health
```

应该返回：
```json
{
  "success": true,
  "message": "服务运行正常",
  "timestamp": "..."
}
```

---

## 🔄 更新应用

配置自动部署后，只需：

```bash
cd /home/devbox/project

# 修改代码
git add .
git commit -m "更新功能"
git push

# Sealos 自动构建并部署！
```

---

## 🆘 如果遇到问题

### 问题 1：找不到 App Launchpad
- 确认您登录的是正确的 Sealos 账号
- 检查是否有应用管理权限
- 尝试访问：https://cloud.sealos.run/apps

### 问题 2：部署失败
- 查看构建日志
- 检查环境变量是否正确
- 确认数据库连接字符串

### 问题 3：应用无法访问
- 检查容器端口配置（5000）
- 查看 Pod 日志
- 确认外网访问已开启

---

## 📞 获取帮助

如果您在操作过程中遇到问题：
1. 截图 Sealos 界面给我看
2. 复制错误信息告诉我
3. 我会指导您完成部署

---

**🎯 重点**：LAF 是云函数平台，不适合您的应用。请使用 Sealos App Launchpad！
