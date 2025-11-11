# 🚀 Sealos 平台快速部署指南

针对您使用的 Sealos 云平台，这是最简单快速的部署方案。

---

## 🎯 推荐方案：使用 Sealos App Launchpad

### 方式 A：从 Git 仓库自动部署（最推荐）

#### 1. 准备 Git 仓库

```bash
# 初始化 Git（如果还没有）
cd /home/devbox/project
git init
git add .
git commit -m "Initial commit"

# 推送到 GitHub/GitLab
git remote add origin YOUR_GIT_URL
git push -u origin main
```

#### 2. 在 Sealos 控制台部署

1. 访问 https://cloud.sealos.run/
2. 登录您的账号（ns-cxxiwxce）
3. 点击 **App Launchpad**
4. 点击 **新建应用**
5. 选择 **从 Git 仓库部署**

#### 3. 配置部署参数

```yaml
应用名称: backend-api
Git 仓库地址: https://github.com/YOUR_USERNAME/YOUR_REPO.git
分支: main
构建命令: npm install --production
启动命令: node server.js
端口: 5000
```

#### 4. 配置环境变量

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin
```

#### 5. 配置资源和域名

- **CPU**: 0.1 - 0.5 核
- **内存**: 256Mi - 512Mi
- **副本数**: 2
- **自动缩放**: 开启（可选）

#### 6. 启用自动部署

✅ 勾选 "启用自动构建"

每次 `git push` 代码后，Sealos 会自动：
- 拉取最新代码
- 构建新镜像
- 滚动更新部署
- 零停机时间

---

## ⚡ 方式 B：手动上传代码部署（快速测试）

### 适用场景
- 没有 Git 仓库
- 快速测试更新
- 临时修改

### 步骤

#### 1. 创建部署包

```bash
cd /home/devbox/project

# 创建干净的部署包
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

echo "✅ 部署包已创建: $(pwd)/backend-deploy.tar.gz"
ls -lh backend-deploy.tar.gz
```

#### 2. 在 Sealos 控制台上传

1. 访问 https://cloud.sealos.run/
2. 进入 **App Launchpad**
3. 找到您的 `backend-api` 应用
4. 点击 **更新**
5. 选择 **上传代码**
6. 上传 `backend-deploy.tar.gz`
7. 点击 **部署**

#### 3. 等待部署完成

Sealos 会自动：
- 解压代码
- 安装依赖
- 构建镜像
- 更新应用

---

## 🔄 方式 C：使用 kubectl 命令行部署

### 适用场景
- 有 Kubernetes 经验
- 需要精细控制
- 脚本化部署

### 快速部署命令

```bash
# 1. 设置环境
export KUBECONFIG="/home/devbox/project/kubeconfig (4).yaml"

# 2. 应用 Kubernetes 配置
kubectl apply -f k8s/backend-deployment.yaml

# 3. 查看部署状态
kubectl get pods -n ns-cxxiwxce -l app=backend-api

# 4. 查看服务
kubectl get svc -n ns-cxxiwxce backend-api
```

### 更新镜像版本

```bash
# 构建并推送新镜像（如果使用远程仓库）
docker build -t registry.cn-shanghai.aliyuncs.com/YOUR_USERNAME/backend-api:v1.0.1 .
docker push registry.cn-shanghai.aliyuncs.com/YOUR_USERNAME/backend-api:v1.0.1

# 更新 Deployment
kubectl set image deployment/backend-api \
  backend-api=registry.cn-shanghai.aliyuncs.com/YOUR_USERNAME/backend-api:v1.0.1 \
  -n ns-cxxiwxce

# 查看滚动更新状态
kubectl rollout status deployment/backend-api -n ns-cxxiwxce
```

---

## 🎨 配置 Sealos 自动构建触发器

### Webhook 配置

1. **在 Sealos 控制台**
   - 进入应用详情
   - 找到 "Webhook URL"
   - 复制 URL

2. **在 GitHub/GitLab 仓库设置**
   - Settings → Webhooks
   - 粘贴 Sealos Webhook URL
   - 选择触发事件：Push events
   - 保存

3. **测试自动部署**
   ```bash
   git commit -am "Test auto deploy"
   git push
   ```

---

## 📊 监控和管理

### 查看应用状态

```bash
# 查看 Pods
kubectl get pods -n ns-cxxiwxce -l app=backend-api

# 查看详细信息
kubectl describe deployment backend-api -n ns-cxxiwxce

# 实时日志
kubectl logs -f deployment/backend-api -n ns-cxxiwxce
```

### 在 Sealos 控制台查看

- **监控面板**：CPU、内存、网络使用情况
- **日志查看**：实时日志流
- **事件历史**：部署、更新事件
- **流量统计**：请求量、响应时间

---

## 🔧 常用操作

### 重启应用

```bash
# 方法1：使用 kubectl
kubectl rollout restart deployment/backend-api -n ns-cxxiwxce

# 方法2：在 Sealos 控制台点击"重启"按钮
```

### 扩容/缩容

```bash
# 调整副本数
kubectl scale deployment/backend-api --replicas=3 -n ns-cxxiwxce

# 或在 Sealos 控制台调整副本数滑块
```

### 查看版本历史

```bash
# 查看部署历史
kubectl rollout history deployment/backend-api -n ns-cxxiwxce

# 回滚到上一个版本
kubectl rollout undo deployment/backend-api -n ns-cxxiwxce
```

---

## 🌟 最佳实践

### 1. 使用环境变量管理配置

在 Sealos 控制台的"环境变量"面板配置：
- ✅ 数据库连接字符串
- ✅ API 密钥
- ✅ 第三方服务配置

### 2. 设置资源限制

合理设置资源请求和限制：
```
CPU Request: 100m
CPU Limit: 500m
Memory Request: 256Mi
Memory Limit: 512Mi
```

### 3. 配置健康检查

在 Sealos 控制台配置：
- **存活探针**: /health
- **就绪探针**: /health
- 检查间隔: 10秒

### 4. 启用自动缩放

根据 CPU 使用率自动调整副本数：
- 最小副本: 1
- 最大副本: 5
- 目标 CPU: 70%

---

## 🆘 故障排查

### 应用无法访问

1. **检查 Pod 状态**
   ```bash
   kubectl get pods -n ns-cxxiwxce
   ```

2. **查看 Pod 日志**
   ```bash
   kubectl logs <POD_NAME> -n ns-cxxiwxce
   ```

3. **检查服务和端口**
   ```bash
   kubectl get svc -n ns-cxxiwxce
   ```

### 部署更新失败

1. **查看部署事件**
   ```bash
   kubectl describe deployment backend-api -n ns-cxxiwxce
   ```

2. **检查镜像拉取**
   - 验证镜像仓库地址
   - 检查镜像标签是否存在

3. **回滚到上一个版本**
   ```bash
   kubectl rollout undo deployment/backend-api -n ns-cxxiwxce
   ```

---

## 📱 访问地址

- **前端**: https://dlzrpxrppejh.sealoshzh.site
- **后端 API**: https://rtmfnnrfbmyt.sealoshzh.site/api
- **健康检查**: https://rtmfnnrfbmyt.sealoshzh.site/health
- **Sealos 控制台**: https://cloud.sealos.run/

---

## 🎉 总结

使用 Sealos 平台部署应用非常简单：

1. ✅ **首次部署**：在 App Launchpad 创建应用
2. ✅ **自动更新**：配置 Git 自动构建
3. ✅ **手动更新**：上传代码包或使用 kubectl
4. ✅ **监控管理**：使用 Sealos 控制台

**再也不需要手动复制文件到 Pod 了！**
