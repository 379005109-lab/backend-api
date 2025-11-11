# 🚀 云端自动化部署指南

这是一个完整的自动化部署解决方案，**无需每次手动更新 Pod**。

## 📋 方案概述

### 部署方式对比

| 方式 | 自动化程度 | 推荐程度 | 说明 |
|------|-----------|---------|------|
| ❌ 旧方式 | 手动 | 不推荐 | 使用 `kubectl cp` 复制文件到 Pod |
| ✅ 方式一 | 全自动 | ⭐⭐⭐⭐⭐ | GitHub Actions CI/CD（推荐） |
| ✅ 方式二 | 半自动 | ⭐⭐⭐⭐ | 本地一键部署脚本 |
| ✅ 方式三 | 全自动 | ⭐⭐⭐⭐⭐ | Sealos 自动构建部署 |

---

## 🎯 方式一：GitHub Actions 自动部署（最推荐）

### 优势
- ✅ 代码 push 后自动部署
- ✅ 完整的 CI/CD 流程
- ✅ 支持版本回滚
- ✅ 零人工干预

### 配置步骤

#### 1. 初始化 Git 仓库（如果还没有）

```bash
cd /home/devbox/project
git init
git add .
git commit -m "Initial commit"
```

#### 2. 在 GitHub 创建仓库

访问 https://github.com/new 创建新仓库

#### 3. 推送代码到 GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

#### 4. 配置 GitHub Secrets

在 GitHub 仓库的 Settings → Secrets and variables → Actions 中添加：

| Secret 名称 | 说明 | 获取方式 |
|------------|------|---------|
| `DOCKER_USERNAME` | 阿里云镜像仓库用户名 | 阿里云控制台 |
| `DOCKER_PASSWORD` | 阿里云镜像仓库密码 | 阿里云控制台 |
| `KUBE_CONFIG` | Kubernetes 配置文件（Base64编码） | 见下方命令 |

##### 获取 Base64 编码的 kubeconfig：

```bash
cat "/home/devbox/project/kubeconfig (4).yaml" | base64 -w 0
```

#### 5. 触发自动部署

```bash
# 修改代码后
git add .
git commit -m "Update feature"
git push

# 自动触发部署流程：
# 1. 构建 Docker 镜像
# 2. 推送到镜像仓库
# 3. 更新 Kubernetes Deployment
# 4. 自动滚动更新
```

#### 6. 查看部署状态

访问 GitHub 仓库的 Actions 标签页查看部署进度

---

## 🔧 方式二：本地一键部署脚本

### 使用场景
- 没有 GitHub 仓库
- 需要快速测试部署
- 手动控制部署时机

### 使用步骤

#### 1. 给脚本添加执行权限

```bash
chmod +x /home/devbox/project/deploy-auto.sh
```

#### 2. 运行部署脚本

```bash
cd /home/devbox/project
./deploy-auto.sh
```

#### 3. 按提示操作

脚本会自动：
- ✅ 构建 Docker 镜像
- ✅ 可选：推送到镜像仓库
- ✅ 更新 Kubernetes Deployment
- ✅ 等待滚动更新完成
- ✅ 验证部署状态

### 示例输出

```
==========================================
  🚀 自动化云端部署脚本
==========================================

📋 部署配置
  命名空间: ns-cxxiwxce
  部署名称: backend-api
  镜像标签: 20241111-181234

🔨 步骤 1: 构建 Docker 镜像
✅ Docker 镜像构建成功

📤 步骤 2: 推送 Docker 镜像
✅ Docker 镜像推送成功

🚀 步骤 5: 更新部署
✅ 部署已更新

⏳ 等待滚动更新完成...
deployment "backend-api" successfully rolled out

✅ 部署完成！
```

---

## 🌐 方式三：Sealos 自动构建部署

### 使用 Sealos 平台的自动构建功能

#### 1. 访问 Sealos 控制台

https://cloud.sealos.run/

#### 2. 创建或更新应用

在 App Launchpad 中：
- 选择 "从 Git 仓库部署"
- 输入 GitHub 仓库地址
- 配置自动构建触发器

#### 3. 配置 Webhook（可选）

在 GitHub 仓库设置 Webhook，指向 Sealos 提供的 URL，实现代码 push 自动触发构建。

---

## 📊 部署验证

### 1. 检查 Pod 状态

```bash
export KUBECONFIG="/home/devbox/project/kubeconfig (4).yaml"
kubectl get pods -n ns-cxxiwxce -l app=backend-api
```

### 2. 查看部署历史

```bash
kubectl rollout history deployment/backend-api -n ns-cxxiwxce
```

### 3. 查看实时日志

```bash
kubectl logs -f deployment/backend-api -n ns-cxxiwxce
```

### 4. 测试 API

```bash
curl https://rtmfnnrfbmyt.sealoshzh.site/health
```

---

## 🔄 版本回滚

### 如果新版本有问题，快速回滚

```bash
# 查看历史版本
kubectl rollout history deployment/backend-api -n ns-cxxiwxce

# 回滚到上一个版本
kubectl rollout undo deployment/backend-api -n ns-cxxiwxce

# 回滚到指定版本
kubectl rollout undo deployment/backend-api --to-revision=2 -n ns-cxxiwxce
```

---

## 🛠️ 常见问题

### Q1: 镜像拉取失败怎么办？

**原因**：镜像仓库认证失败

**解决**：
```bash
# 创建 Docker Registry Secret
kubectl create secret docker-registry regcred \
  --docker-server=registry.cn-shanghai.aliyuncs.com \
  --docker-username=YOUR_USERNAME \
  --docker-password=YOUR_PASSWORD \
  --docker-email=YOUR_EMAIL \
  -n ns-cxxiwxce

# 在 Deployment 中引用 Secret
# 在 spec.template.spec 中添加：
# imagePullSecrets:
# - name: regcred
```

### Q2: 部署卡住不更新怎么办？

**原因**：Pod 启动失败或健康检查失败

**排查**：
```bash
# 查看 Pod 状态
kubectl get pods -n ns-cxxiwxce -l app=backend-api

# 查看 Pod 详情
kubectl describe pod <POD_NAME> -n ns-cxxiwxce

# 查看 Pod 日志
kubectl logs <POD_NAME> -n ns-cxxiwxce
```

### Q3: 如何加速镜像构建？

**优化 Dockerfile**：
- ✅ 使用多阶段构建
- ✅ 合理使用缓存层
- ✅ 优化 .dockerignore

---

## 📝 环境变量配置

在 Kubernetes Secret 中配置敏感信息：

```bash
kubectl create secret generic backend-secrets \
  --from-literal=mongodb-uri='mongodb://root:q5rdw4tb@test-db-mongodb.ns-cxxiwxce.svc:27017/backend_db?authSource=admin' \
  --from-literal=jwt-secret='your-super-secret-key' \
  -n ns-cxxiwxce
```

---

## 🎯 最佳实践

1. **使用 Git 标签管理版本**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **配置资源限制**
   - CPU: 100m - 500m
   - Memory: 256Mi - 512Mi

3. **设置健康检查**
   - Liveness Probe：确保容器运行
   - Readiness Probe：确保服务就绪

4. **使用滚动更新**
   - maxSurge: 1（最多多1个新Pod）
   - maxUnavailable: 0（保证零停机）

5. **监控和日志**
   - 定期查看 Pod 日志
   - 配置告警通知

---

## 🔗 相关链接

- Sealos 控制台: https://cloud.sealos.run/
- GitHub Actions 文档: https://docs.github.com/actions
- Kubernetes 文档: https://kubernetes.io/docs/
- Docker 文档: https://docs.docker.com/

---

## 📞 支持

如有问题，请：
1. 查看 Pod 日志排查问题
2. 检查网络连接
3. 验证配置文件正确性

---

**🎉 现在您拥有了完整的自动化部署方案，再也不需要手动更新 Pod 了！**
