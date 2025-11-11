# 🚀 Sealos 部署操作步骤

## 📋 您已完成：
✅ Git 仓库已初始化
✅ 代码已提交到本地 Git

---

## 方案 A：GitHub + Sealos 自动部署（推荐）

### 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建新仓库（Repository name: `backend-api`）
3. 设置为 Public 或 Private
4. **不要** 勾选 "Initialize this repository"
5. 点击 "Create repository"

### 步骤 2：推送代码到 GitHub

复制 GitHub 提供的命令，或使用以下命令：

```bash
cd /home/devbox/project

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/backend-api.git

# 推送代码
git push -u origin main
```

### 步骤 3：在 Sealos 创建应用

根据您的截图：

1. **点击 "云开发" 图标**（蓝色图标，App Launchpad）

2. **点击 "新建应用" 或 "+ 创建"**

3. **选择 "从 Git 仓库部署"**

4. **填写配置**：
   ```
   应用名称: backend-api
   
   Git 仓库地址: https://github.com/YOUR_USERNAME/backend-api.git
   
   分支: main
   
   根目录: /
   
   构建命令: npm install --production
   
   启动命令: node server.js
   
   端口: 5000
   ```

5. **配置环境变量**（点击"添加环境变量"）：
   ```
   NODE_ENV = production
   PORT = 5000
   MONGODB_URI = mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin
   ```

6. **配置资源**：
   - CPU: 0.1 - 0.5 核
   - 内存: 256Mi - 512Mi
   - 副本数: 2

7. **启用自动构建**：
   - ✅ 勾选 "启用自动构建" 或 "Auto Deploy"
   - 这样每次 `git push` 都会自动部署！

8. **点击 "部署" 或 "Deploy"**

### 步骤 4：配置 Webhook（可选，增强自动化）

部署成功后，在 Sealos 应用详情页找到 Webhook URL，然后：

1. 访问 GitHub 仓库的 Settings
2. 点击 "Webhooks" → "Add webhook"
3. 粘贴 Sealos 提供的 Webhook URL
4. 选择 "Just the push event"
5. 保存

---

## 方案 B：直接在 Sealos 部署（无需 GitHub）

如果您不想使用 GitHub：

### 步骤 1：准备部署包

在终端运行：
```bash
cd /home/devbox/project

tar -czf backend-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='logs' \
  --exclude='.git' \
  --exclude='*.md' \
  --exclude='*.sh' \
  --exclude='*.tar.gz' \
  --exclude='test-*.js' \
  --exclude='kubeconfig*.yaml' \
  .

echo "✅ 部署包已创建"
ls -lh backend-deploy.tar.gz
```

### 步骤 2：在 Sealos 上传部署

1. **点击 "云开发" 图标**

2. 如果已有 `backend-api` 应用：
   - 找到应用 → 点击 "更新"
   - 选择 "上传代码"
   - 上传 `backend-deploy.tar.gz`
   - 点击 "部署"

3. 如果是新建应用：
   - 点击 "新建应用"
   - 选择 "从代码上传"
   - 上传 `backend-deploy.tar.gz`
   - 配置环境变量（同上）
   - 点击 "部署"

---

## 📊 部署后验证

### 查看应用状态

在 Sealos 控制台：
- 查看 Pod 状态（应该显示 Running）
- 查看日志输出
- 访问自动生成的域名

### 测试 API

```bash
# 测试健康检查
curl https://YOUR_APP_DOMAIN/health

# 应该返回：
# {"success":true,"message":"服务运行正常","timestamp":"..."}
```

---

## 🎉 完成后的效果

### 使用方案 A（GitHub）：
```bash
# 修改代码后
git add .
git commit -m "更新功能"
git push

# 🎊 自动触发部署！
# Sealos 会自动：
# 1. 拉取最新代码
# 2. 构建新镜像
# 3. 滚动更新应用
# 4. 零停机部署
```

### 使用方案 B（直接上传）：
每次更新需要：
1. 创建新的部署包
2. 在 Sealos 控制台上传
3. 点击部署

---

## 🔍 常见问题

### Q: 找不到 "云开发" 图标？
A: 在您的截图中，"云开发" 是绿色图标，可能也叫 "App Launchpad" 或 "应用启动器"

### Q: 部署失败怎么办？
A: 
1. 查看 Pod 日志
2. 检查环境变量是否正确
3. 确认数据库连接字符串
4. 查看构建日志

### Q: 如何查看当前使用的域名？
A: 在 Sealos 应用详情页，会显示自动分配的访问域名

---

## 📞 需要帮助？

如果遇到问题，请：
1. 截图 Sealos 的错误信息
2. 查看应用日志
3. 告诉我具体的错误内容

---

**推荐使用方案 A（GitHub），配置一次后永久自动化！**
